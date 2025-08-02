// Billing Controller - Gerenciamento de cobrança e créditos
const { pool } = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

class BillingController {
    // Obter resumo de billing atual
    async getCurrentBilling(req, res) {
        try {
            const { organizationId } = req.user;
            
            const query = `
                WITH current_usage AS (
                    SELECT 
                        COUNT(*) as total_requests,
                        SUM(tokens_used) as total_tokens,
                        SUM(cost_cents) as total_cost_cents
                    FROM usage_logs
                    WHERE organization_id = $1
                        AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
                ),
                organization_info AS (
                    SELECT 
                        plan,
                        credits,
                        monthly_limit_cents,
                        stripe_customer_id,
                        stripe_subscription_id
                    FROM organizations
                    WHERE id = $1
                ),
                last_payments AS (
                    SELECT 
                        amount_cents,
                        credits_purchased,
                        created_at,
                        status
                    FROM payments
                    WHERE organization_id = $1
                    ORDER BY created_at DESC
                    LIMIT 5
                )
                SELECT 
                    (SELECT row_to_json(current_usage) FROM current_usage) as usage,
                    (SELECT row_to_json(organization_info) FROM organization_info) as organization,
                    (SELECT json_agg(row_to_json(last_payments)) FROM last_payments) as recent_payments
            `;
            
            const result = await pool.query(query, [organizationId]);
            const billing = result.rows[0];
            
            // Calcular informações adicionais
            const usage = billing.usage || {};
            const org = billing.organization || {};
            
            const response = {
                current_month: {
                    usage_cents: usage.total_cost_cents || 0,
                    tokens_used: usage.total_tokens || 0,
                    requests_count: usage.total_requests || 0,
                    remaining_credits: org.credits || 0,
                    monthly_limit_cents: org.monthly_limit_cents || 0,
                    usage_percentage: org.monthly_limit_cents > 0 
                        ? ((usage.total_cost_cents || 0) / org.monthly_limit_cents * 100).toFixed(2)
                        : 0
                },
                plan: {
                    current: org.plan || 'free',
                    stripe_customer_id: org.stripe_customer_id,
                    stripe_subscription_id: org.stripe_subscription_id
                },
                recent_payments: billing.recent_payments || []
            };
            
            res.json(response);
            
        } catch (error) {
            logger.error('Error fetching current billing', error);
            res.status(500).json({ error: 'Failed to fetch billing information' });
        }
    }

    // Obter histórico de cobrança
    async getBillingHistory(req, res) {
        try {
            const { organizationId } = req.user;
            const { startDate, endDate, page = 1, limit = 20 } = req.query;
            
            const offset = (page - 1) * limit;
            
            const query = `
                SELECT 
                    DATE_TRUNC('month', created_at) as billing_period,
                    COUNT(*) as total_requests,
                    SUM(tokens_used) as total_tokens,
                    SUM(cost_cents) as total_cost_cents,
                    json_agg(json_build_object(
                        'provider', provider,
                        'model_id', model_id,
                        'requests', request_count,
                        'tokens', token_count,
                        'cost_cents', model_cost_cents
                    )) as breakdown_by_model
                FROM (
                    SELECT 
                        created_at,
                        provider,
                        model_id,
                        tokens_used,
                        cost_cents,
                        COUNT(*) OVER (PARTITION BY DATE_TRUNC('month', created_at), provider, model_id) as request_count,
                        SUM(tokens_used) OVER (PARTITION BY DATE_TRUNC('month', created_at), provider, model_id) as token_count,
                        SUM(cost_cents) OVER (PARTITION BY DATE_TRUNC('month', created_at), provider, model_id) as model_cost_cents
                    FROM usage_logs
                    WHERE organization_id = $1
                        AND ($2::timestamp IS NULL OR created_at >= $2)
                        AND ($3::timestamp IS NULL OR created_at <= $3)
                ) aggregated
                GROUP BY billing_period
                ORDER BY billing_period DESC
                LIMIT $4 OFFSET $5
            `;
            
            const countQuery = `
                SELECT COUNT(DISTINCT DATE_TRUNC('month', created_at)) as total
                FROM usage_logs
                WHERE organization_id = $1
                    AND ($2::timestamp IS NULL OR created_at >= $2)
                    AND ($3::timestamp IS NULL OR created_at <= $3)
            `;
            
            const [billingResult, countResult] = await Promise.all([
                pool.query(query, [organizationId, startDate, endDate, limit, offset]),
                pool.query(countQuery, [organizationId, startDate, endDate])
            ]);
            
            const response = {
                billing_periods: billingResult.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: countResult.rows[0].total,
                    pages: Math.ceil(countResult.rows[0].total / limit)
                }
            };
            
            res.json(response);
            
        } catch (error) {
            logger.error('Error fetching billing history', error);
            res.status(500).json({ error: 'Failed to fetch billing history' });
        }
    }

    // Comprar créditos
    async purchaseCredits(req, res) {
        const client = await pool.connect();
        
        try {
            const { organizationId, userId } = req.user;
            const { credits, payment_method_id } = req.body;
            
            if (!credits || credits < 1000) {
                return res.status(400).json({ error: 'Minimum purchase is 1000 credits' });
            }
            
            await client.query('BEGIN');
            
            // Buscar organização
            const orgQuery = 'SELECT stripe_customer_id FROM organizations WHERE id = $1';
            const orgResult = await client.query(orgQuery, [organizationId]);
            
            if (orgResult.rows.length === 0) {
                throw new Error('Organization not found');
            }
            
            let stripeCustomerId = orgResult.rows[0].stripe_customer_id;
            
            // Criar customer no Stripe se não existir
            if (!stripeCustomerId) {
                const customer = await stripe.customers.create({
                    metadata: { organization_id: organizationId }
                });
                
                stripeCustomerId = customer.id;
                
                await client.query(
                    'UPDATE organizations SET stripe_customer_id = $1 WHERE id = $2',
                    [stripeCustomerId, organizationId]
                );
            }
            
            // Calcular preço (1 crédito = $0.001)
            const amountCents = Math.round(credits * 0.1); // $0.001 per credit
            
            // Criar payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountCents,
                currency: 'usd',
                customer: stripeCustomerId,
                payment_method: payment_method_id,
                confirm: true,
                metadata: {
                    organization_id: organizationId,
                    credits: credits.toString(),
                    type: 'credit_purchase'
                }
            });
            
            if (paymentIntent.status !== 'succeeded') {
                throw new Error('Payment failed');
            }
            
            // Registrar pagamento
            const paymentQuery = `
                INSERT INTO payments (
                    organization_id,
                    stripe_payment_intent_id,
                    amount_cents,
                    credits_purchased,
                    status,
                    created_by
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `;
            
            const paymentResult = await client.query(paymentQuery, [
                organizationId,
                paymentIntent.id,
                amountCents,
                credits,
                'completed',
                userId
            ]);
            
            // Adicionar créditos à organização
            await client.query(
                'UPDATE organizations SET credits = credits + $1, updated_at = NOW() WHERE id = $2',
                [credits, organizationId]
            );
            
            // Log de auditoria
            await client.query(`
                INSERT INTO audit_logs (
                    organization_id,
                    user_id,
                    action,
                    resource_type,
                    resource_id,
                    details
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                organizationId,
                userId,
                'credits_purchased',
                'payment',
                paymentResult.rows[0].id,
                JSON.stringify({ credits, amount_cents: amountCents })
            ]);
            
            await client.query('COMMIT');
            
            logger.info('Credits purchased', {
                organizationId,
                credits,
                amountCents,
                paymentIntentId: paymentIntent.id
            });
            
            res.json({
                success: true,
                credits_purchased: credits,
                new_balance: (await this.getCreditsBalance(organizationId)).credits,
                payment_id: paymentIntent.id
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error purchasing credits', error);
            res.status(500).json({ error: 'Failed to purchase credits' });
        } finally {
            client.release();
        }
    }

    // Obter faturas
    async getInvoices(req, res) {
        try {
            const { organizationId } = req.user;
            const { page = 1, limit = 20 } = req.query;
            
            const offset = (page - 1) * limit;
            
            const query = `
                SELECT 
                    i.id,
                    i.invoice_number,
                    i.billing_period_start,
                    i.billing_period_end,
                    i.total_amount_cents,
                    i.status,
                    i.stripe_invoice_id,
                    i.pdf_url,
                    i.created_at,
                    json_build_object(
                        'total_requests', i.usage_summary->>'total_requests',
                        'total_tokens', i.usage_summary->>'total_tokens',
                        'total_credits_used', i.usage_summary->>'total_credits_used'
                    ) as usage_summary
                FROM invoices i
                WHERE i.organization_id = $1
                ORDER BY i.created_at DESC
                LIMIT $2 OFFSET $3
            `;
            
            const countQuery = `
                SELECT COUNT(*) as total
                FROM invoices
                WHERE organization_id = $1
            `;
            
            const [invoicesResult, countResult] = await Promise.all([
                pool.query(query, [organizationId, limit, offset]),
                pool.query(countQuery, [organizationId])
            ]);
            
            const response = {
                invoices: invoicesResult.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: countResult.rows[0].total,
                    pages: Math.ceil(countResult.rows[0].total / limit)
                }
            };
            
            res.json(response);
            
        } catch (error) {
            logger.error('Error fetching invoices', error);
            res.status(500).json({ error: 'Failed to fetch invoices' });
        }
    }

    // Obter métodos de pagamento
    async getPaymentMethods(req, res) {
        try {
            const { organizationId } = req.user;
            
            const orgQuery = 'SELECT stripe_customer_id FROM organizations WHERE id = $1';
            const orgResult = await pool.query(orgQuery, [organizationId]);
            
            if (!orgResult.rows[0]?.stripe_customer_id) {
                return res.json({ payment_methods: [] });
            }
            
            const paymentMethods = await stripe.paymentMethods.list({
                customer: orgResult.rows[0].stripe_customer_id,
                type: 'card'
            });
            
            const methods = paymentMethods.data.map(pm => ({
                id: pm.id,
                brand: pm.card.brand,
                last4: pm.card.last4,
                exp_month: pm.card.exp_month,
                exp_year: pm.card.exp_year,
                is_default: pm.id === pm.customer?.invoice_settings?.default_payment_method
            }));
            
            res.json({ payment_methods: methods });
            
        } catch (error) {
            logger.error('Error fetching payment methods', error);
            res.status(500).json({ error: 'Failed to fetch payment methods' });
        }
    }

    // Adicionar método de pagamento
    async addPaymentMethod(req, res) {
        try {
            const { organizationId } = req.user;
            const { payment_method_id, set_as_default } = req.body;
            
            const orgQuery = 'SELECT stripe_customer_id FROM organizations WHERE id = $1';
            const orgResult = await pool.query(orgQuery, [organizationId]);
            
            let stripeCustomerId = orgResult.rows[0]?.stripe_customer_id;
            
            if (!stripeCustomerId) {
                const customer = await stripe.customers.create({
                    metadata: { organization_id: organizationId }
                });
                
                stripeCustomerId = customer.id;
                
                await pool.query(
                    'UPDATE organizations SET stripe_customer_id = $1 WHERE id = $2',
                    [stripeCustomerId, organizationId]
                );
            }
            
            // Anexar método de pagamento ao customer
            await stripe.paymentMethods.attach(payment_method_id, {
                customer: stripeCustomerId
            });
            
            // Definir como padrão se solicitado
            if (set_as_default) {
                await stripe.customers.update(stripeCustomerId, {
                    invoice_settings: {
                        default_payment_method: payment_method_id
                    }
                });
            }
            
            res.json({ success: true });
            
        } catch (error) {
            logger.error('Error adding payment method', error);
            res.status(500).json({ error: 'Failed to add payment method' });
        }
    }

    // Remover método de pagamento
    async removePaymentMethod(req, res) {
        try {
            const { payment_method_id } = req.params;
            
            await stripe.paymentMethods.detach(payment_method_id);
            
            res.json({ success: true });
            
        } catch (error) {
            logger.error('Error removing payment method', error);
            res.status(500).json({ error: 'Failed to remove payment method' });
        }
    }

    // Atualizar plano
    async updatePlan(req, res) {
        const client = await pool.connect();
        
        try {
            const { organizationId, userId } = req.user;
            const { plan_id, payment_method_id } = req.body;
            
            await client.query('BEGIN');
            
            // Buscar informações do plano
            const plans = {
                free: { price: 0, credits_monthly: 1000 },
                starter: { price: 2900, credits_monthly: 50000, stripe_price_id: 'price_starter' },
                pro: { price: 9900, credits_monthly: 200000, stripe_price_id: 'price_pro' },
                enterprise: { price: 29900, credits_monthly: 1000000, stripe_price_id: 'price_enterprise' }
            };
            
            const newPlan = plans[plan_id];
            if (!newPlan) {
                throw new Error('Invalid plan');
            }
            
            const orgQuery = 'SELECT plan, stripe_customer_id, stripe_subscription_id FROM organizations WHERE id = $1';
            const orgResult = await client.query(orgQuery, [organizationId]);
            const org = orgResult.rows[0];
            
            // Cancelar assinatura existente se houver
            if (org.stripe_subscription_id) {
                await stripe.subscriptions.cancel(org.stripe_subscription_id);
            }
            
            let subscriptionId = null;
            
            // Criar nova assinatura se não for plano free
            if (plan_id !== 'free') {
                const subscription = await stripe.subscriptions.create({
                    customer: org.stripe_customer_id,
                    items: [{ price: newPlan.stripe_price_id }],
                    default_payment_method: payment_method_id,
                    metadata: {
                        organization_id: organizationId,
                        plan: plan_id
                    }
                });
                
                subscriptionId = subscription.id;
            }
            
            // Atualizar plano na organização
            await client.query(`
                UPDATE organizations 
                SET plan = $1, 
                    stripe_subscription_id = $2,
                    monthly_limit_cents = $3,
                    updated_at = NOW()
                WHERE id = $4
            `, [plan_id, subscriptionId, newPlan.price, organizationId]);
            
            // Log de auditoria
            await client.query(`
                INSERT INTO audit_logs (
                    organization_id,
                    user_id,
                    action,
                    resource_type,
                    resource_id,
                    details
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                organizationId,
                userId,
                'plan_updated',
                'organization',
                organizationId,
                JSON.stringify({ from: org.plan, to: plan_id })
            ]);
            
            await client.query('COMMIT');
            
            res.json({
                success: true,
                plan: plan_id,
                subscription_id: subscriptionId
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error updating plan', error);
            res.status(500).json({ error: 'Failed to update plan' });
        } finally {
            client.release();
        }
    }

    // Helper: Obter saldo de créditos
    async getCreditsBalance(organizationId) {
        const query = 'SELECT credits FROM organizations WHERE id = $1';
        const result = await pool.query(query, [organizationId]);
        return result.rows[0] || { credits: 0 };
    }
}

module.exports = new BillingController();