// Metrics Service - Coleta e agregação de métricas de uso
const { pool } = require('../config/database');
const { redis } = require('../config/redis');
const logger = require('../utils/logger');

class MetricsService {
    constructor() {
        this.cachePrefix = 'metrics';
        this.cacheTTL = 300; // 5 minutos
    }

    // Registrar uso de API
    async recordUsage(data) {
        const client = await pool.connect();
        
        try {
            const query = `
                INSERT INTO usage_logs (
                    organization_id,
                    user_id,
                    model_id,
                    provider,
                    tokens_used,
                    cost_cents,
                    request_data,
                    response_data,
                    latency_ms,
                    status_code,
                    error_message
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id
            `;
            
            const result = await client.query(query, [
                data.organizationId,
                data.userId,
                data.modelId,
                data.provider,
                data.tokensUsed,
                data.costCents,
                JSON.stringify(data.requestData || {}),
                JSON.stringify(data.responseData || {}),
                data.latencyMs,
                data.statusCode,
                data.errorMessage || null
            ]);
            
            // Atualizar métricas em tempo real no Redis
            await this.updateRealtimeMetrics(data);
            
            // Invalidar cache de métricas agregadas
            await this.invalidateMetricsCache(data.organizationId);
            
            logger.info('Usage recorded', {
                organizationId: data.organizationId,
                modelId: data.modelId,
                tokens: data.tokensUsed
            });
            
            return result.rows[0].id;
            
        } catch (error) {
            logger.error('Error recording usage', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Obter visão geral de métricas
    async getOverview(organizationId, timeRange = '7d') {
        const cacheKey = `${this.cachePrefix}:overview:${organizationId}:${timeRange}`;
        
        // Verificar cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        
        const startDate = this.getStartDate(timeRange);
        
        const query = `
            WITH usage_stats AS (
                SELECT 
                    COUNT(*) as total_requests,
                    SUM(tokens_used) as total_tokens,
                    SUM(cost_cents) as total_cost_cents,
                    AVG(latency_ms) as avg_latency_ms,
                    COUNT(DISTINCT user_id) as unique_users,
                    COUNT(DISTINCT DATE(created_at)) as active_days,
                    SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
                FROM usage_logs
                WHERE organization_id = $1
                    AND created_at >= $2
            ),
            popular_models AS (
                SELECT 
                    model_id,
                    provider,
                    COUNT(*) as usage_count,
                    SUM(tokens_used) as tokens_used
                FROM usage_logs
                WHERE organization_id = $1
                    AND created_at >= $2
                GROUP BY model_id, provider
                ORDER BY usage_count DESC
                LIMIT 5
            ),
            hourly_usage AS (
                SELECT 
                    DATE_TRUNC('hour', created_at) as hour,
                    COUNT(*) as requests,
                    SUM(tokens_used) as tokens
                FROM usage_logs
                WHERE organization_id = $1
                    AND created_at >= $2
                GROUP BY hour
                ORDER BY hour
            )
            SELECT 
                (SELECT row_to_json(usage_stats) FROM usage_stats) as summary,
                (SELECT json_agg(row_to_json(popular_models)) FROM popular_models) as top_models,
                (SELECT json_agg(json_build_object(
                    'timestamp', hour,
                    'requests', requests,
                    'tokens', tokens
                )) FROM hourly_usage) as hourly_data
        `;
        
        const result = await pool.query(query, [organizationId, startDate]);
        const overview = result.rows[0];
        
        // Adicionar métricas em tempo real
        const realtimeMetrics = await this.getRealtimeMetrics(organizationId);
        overview.realtime = realtimeMetrics;
        
        // Cachear resultado
        await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(overview));
        
        return overview;
    }

    // Obter métricas de uso detalhadas
    async getUsageMetrics(organizationId, filters = {}) {
        const cacheKey = `${this.cachePrefix}:usage:${organizationId}:${JSON.stringify(filters)}`;
        
        // Verificar cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        
        const { startDate, endDate, groupBy = 'day', modelId, userId, provider } = filters;
        
        const dateFormat = {
            'hour': 'YYYY-MM-DD HH24:00',
            'day': 'YYYY-MM-DD',
            'week': 'IYYY-IW',
            'month': 'YYYY-MM'
        }[groupBy] || 'YYYY-MM-DD';
        
        const query = `
            SELECT 
                TO_CHAR(DATE_TRUNC($1, created_at), $2) as period,
                COUNT(*) as request_count,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(tokens_used) as total_tokens,
                SUM(cost_cents) as total_cost_cents,
                AVG(latency_ms)::INTEGER as avg_latency_ms,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latency_ms)::INTEGER as p50_latency_ms,
                PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms)::INTEGER as p95_latency_ms,
                SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
                ROUND(100.0 * SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as error_rate
            FROM usage_logs
            WHERE organization_id = $3
                AND created_at >= $4
                AND created_at <= $5
                AND ($6::text IS NULL OR model_id = $6)
                AND ($7::uuid IS NULL OR user_id = $7)
                AND ($8::text IS NULL OR provider = $8)
            GROUP BY period
            ORDER BY period
        `;
        
        const params = [
            groupBy,
            dateFormat,
            organizationId,
            startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            endDate || new Date(),
            modelId || null,
            userId || null,
            provider || null
        ];
        
        const result = await pool.query(query, params);
        
        const metrics = {
            data: result.rows,
            groupBy,
            filters: { startDate, endDate, modelId, userId, provider }
        };
        
        // Cachear resultado
        await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(metrics));
        
        return metrics;
    }

    // Obter métricas de custo
    async getCostMetrics(organizationId, timeRange = '30d') {
        const cacheKey = `${this.cachePrefix}:costs:${organizationId}:${timeRange}`;
        
        // Verificar cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        
        const startDate = this.getStartDate(timeRange);
        
        const query = `
            WITH cost_by_provider AS (
                SELECT 
                    provider,
                    SUM(cost_cents) as total_cost_cents,
                    SUM(tokens_used) as total_tokens,
                    COUNT(*) as request_count,
                    ROUND(SUM(cost_cents)::NUMERIC / NULLIF(SUM(tokens_used), 0) * 1000, 4) as cost_per_1k_tokens
                FROM usage_logs
                WHERE organization_id = $1
                    AND created_at >= $2
                GROUP BY provider
            ),
            cost_by_model AS (
                SELECT 
                    model_id,
                    provider,
                    SUM(cost_cents) as total_cost_cents,
                    SUM(tokens_used) as total_tokens,
                    COUNT(*) as request_count
                FROM usage_logs
                WHERE organization_id = $1
                    AND created_at >= $2
                GROUP BY model_id, provider
                ORDER BY total_cost_cents DESC
                LIMIT 10
            ),
            cost_by_user AS (
                SELECT 
                    u.user_id,
                    users.email,
                    users.name,
                    SUM(u.cost_cents) as total_cost_cents,
                    SUM(u.tokens_used) as total_tokens,
                    COUNT(*) as request_count
                FROM usage_logs u
                JOIN users ON users.id = u.user_id
                WHERE u.organization_id = $1
                    AND u.created_at >= $2
                GROUP BY u.user_id, users.email, users.name
                ORDER BY total_cost_cents DESC
                LIMIT 10
            ),
            daily_costs AS (
                SELECT 
                    DATE(created_at) as date,
                    SUM(cost_cents) as daily_cost_cents
                FROM usage_logs
                WHERE organization_id = $1
                    AND created_at >= $2
                GROUP BY date
                ORDER BY date
            )
            SELECT 
                (SELECT json_agg(row_to_json(cost_by_provider)) FROM cost_by_provider) as by_provider,
                (SELECT json_agg(row_to_json(cost_by_model)) FROM cost_by_model) as by_model,
                (SELECT json_agg(row_to_json(cost_by_user)) FROM cost_by_user) as by_user,
                (SELECT json_agg(json_build_object(
                    'date', date,
                    'cost_cents', daily_cost_cents
                )) FROM daily_costs) as daily_trend,
                (SELECT SUM(cost_cents) FROM usage_logs WHERE organization_id = $1 AND created_at >= $2) as total_cost_cents
        `;
        
        const result = await pool.query(query, [organizationId, startDate]);
        const costMetrics = result.rows[0];
        
        // Adicionar previsão de custos
        costMetrics.projection = await this.projectCosts(organizationId, costMetrics.daily_trend);
        
        // Cachear resultado
        await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(costMetrics));
        
        return costMetrics;
    }

    // Obter métricas de performance
    async getPerformanceMetrics(organizationId, timeRange = '24h') {
        const cacheKey = `${this.cachePrefix}:performance:${organizationId}:${timeRange}`;
        
        // Verificar cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        
        const startDate = this.getStartDate(timeRange);
        
        const query = `
            WITH latency_stats AS (
                SELECT 
                    provider,
                    model_id,
                    COUNT(*) as request_count,
                    AVG(latency_ms)::INTEGER as avg_latency,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latency_ms)::INTEGER as p50_latency,
                    PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY latency_ms)::INTEGER as p90_latency,
                    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms)::INTEGER as p95_latency,
                    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY latency_ms)::INTEGER as p99_latency,
                    MIN(latency_ms)::INTEGER as min_latency,
                    MAX(latency_ms)::INTEGER as max_latency
                FROM usage_logs
                WHERE organization_id = $1
                    AND created_at >= $2
                    AND status_code < 400
                GROUP BY provider, model_id
            ),
            error_stats AS (
                SELECT 
                    provider,
                    model_id,
                    COUNT(*) as error_count,
                    COUNT(DISTINCT error_message) as unique_errors,
                    json_agg(DISTINCT json_build_object(
                        'message', error_message,
                        'count', error_count
                    ) ORDER BY error_count DESC) as top_errors
                FROM (
                    SELECT 
                        provider,
                        model_id,
                        error_message,
                        COUNT(*) as error_count
                    FROM usage_logs
                    WHERE organization_id = $1
                        AND created_at >= $2
                        AND status_code >= 400
                        AND error_message IS NOT NULL
                    GROUP BY provider, model_id, error_message
                ) e
                GROUP BY provider, model_id
            ),
            hourly_performance AS (
                SELECT 
                    DATE_TRUNC('hour', created_at) as hour,
                    AVG(latency_ms)::INTEGER as avg_latency,
                    COUNT(*) as requests,
                    SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as errors
                FROM usage_logs
                WHERE organization_id = $1
                    AND created_at >= $2
                GROUP BY hour
                ORDER BY hour DESC
                LIMIT 24
            )
            SELECT 
                (SELECT json_agg(row_to_json(latency_stats)) FROM latency_stats) as latency_by_model,
                (SELECT json_agg(row_to_json(error_stats)) FROM error_stats) as errors_by_model,
                (SELECT json_agg(json_build_object(
                    'timestamp', hour,
                    'avg_latency', avg_latency,
                    'requests', requests,
                    'errors', errors,
                    'error_rate', ROUND(100.0 * errors / NULLIF(requests, 0), 2)
                ) ORDER BY hour) FROM hourly_performance) as hourly_trend
        `;
        
        const result = await pool.query(query, [organizationId, startDate]);
        const performanceMetrics = result.rows[0];
        
        // Adicionar SLO compliance
        performanceMetrics.slo_compliance = await this.calculateSLOCompliance(
            organizationId, 
            startDate
        );
        
        // Cachear resultado
        await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(performanceMetrics));
        
        return performanceMetrics;
    }

    // Atualizar métricas em tempo real
    async updateRealtimeMetrics(data) {
        const key = `${this.cachePrefix}:realtime:${data.organizationId}`;
        const now = new Date();
        const minute = now.getMinutes();
        
        // Incrementar contadores
        await redis.hincrby(key, 'total_requests', 1);
        await redis.hincrby(key, 'total_tokens', data.tokensUsed);
        await redis.hincrby(key, 'total_cost_cents', data.costCents);
        
        if (data.statusCode >= 400) {
            await redis.hincrby(key, 'total_errors', 1);
        }
        
        // Adicionar à lista de latências recentes
        await redis.lpush(`${key}:latencies`, data.latencyMs);
        await redis.ltrim(`${key}:latencies`, 0, 99); // Manter últimas 100
        
        // Expirar em 1 hora
        await redis.expire(key, 3600);
        await redis.expire(`${key}:latencies`, 3600);
    }

    // Obter métricas em tempo real
    async getRealtimeMetrics(organizationId) {
        const key = `${this.cachePrefix}:realtime:${organizationId}`;
        
        const metrics = await redis.hgetall(key);
        const latencies = await redis.lrange(`${key}:latencies`, 0, -1);
        
        if (!metrics.total_requests) {
            return {
                requests_per_minute: 0,
                average_latency_ms: 0,
                error_rate: 0,
                active_users: 0
            };
        }
        
        const latencyNumbers = latencies.map(Number).filter(n => !isNaN(n));
        const avgLatency = latencyNumbers.length > 0
            ? Math.round(latencyNumbers.reduce((a, b) => a + b, 0) / latencyNumbers.length)
            : 0;
        
        return {
            requests_per_minute: parseInt(metrics.total_requests) || 0,
            average_latency_ms: avgLatency,
            error_rate: parseFloat(
                ((parseInt(metrics.total_errors) || 0) / parseInt(metrics.total_requests)) * 100
            ).toFixed(2),
            tokens_per_minute: parseInt(metrics.total_tokens) || 0
        };
    }

    // Projetar custos futuros
    async projectCosts(organizationId, dailyTrend) {
        if (!dailyTrend || dailyTrend.length < 7) {
            return null;
        }
        
        // Calcular média móvel dos últimos 7 dias
        const last7Days = dailyTrend.slice(-7);
        const avgDailyCost = last7Days.reduce((sum, day) => sum + day.cost_cents, 0) / 7;
        
        // Calcular tendência (regressão linear simples)
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        last7Days.forEach((day, index) => {
            sumX += index;
            sumY += day.cost_cents;
            sumXY += index * day.cost_cents;
            sumX2 += index * index;
        });
        
        const n = last7Days.length;
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Projetar próximos 30 dias
        const projectedDailyCost = intercept + slope * (n + 15); // Meio do próximo mês
        
        return {
            current_month_estimate: Math.round(avgDailyCost * 30),
            next_month_estimate: Math.round(projectedDailyCost * 30),
            daily_average: Math.round(avgDailyCost),
            trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
            trend_percentage: parseFloat((slope / avgDailyCost * 100).toFixed(2))
        };
    }

    // Calcular conformidade com SLO
    async calculateSLOCompliance(organizationId, startDate) {
        const query = `
            SELECT 
                COUNT(*) FILTER (WHERE latency_ms <= 1000) as requests_under_1s,
                COUNT(*) FILTER (WHERE status_code < 400) as successful_requests,
                COUNT(*) as total_requests
            FROM usage_logs
            WHERE organization_id = $1
                AND created_at >= $2
        `;
        
        const result = await pool.query(query, [organizationId, startDate]);
        const stats = result.rows[0];
        
        if (stats.total_requests === 0) {
            return {
                latency_slo: 100,
                availability_slo: 100,
                meets_slo: true
            };
        }
        
        const latencySLO = (stats.requests_under_1s / stats.total_requests * 100).toFixed(2);
        const availabilitySLO = (stats.successful_requests / stats.total_requests * 100).toFixed(2);
        
        return {
            latency_slo: parseFloat(latencySLO),
            availability_slo: parseFloat(availabilitySLO),
            meets_slo: latencySLO >= 95 && availabilitySLO >= 99.9
        };
    }

    // Invalidar cache de métricas
    async invalidateMetricsCache(organizationId) {
        const pattern = `${this.cachePrefix}:*:${organizationId}:*`;
        const keys = await redis.keys(pattern);
        
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }

    // Obter data de início baseada no intervalo
    getStartDate(timeRange) {
        const now = new Date();
        const match = timeRange.match(/^(\d+)([hdwmy])$/);
        
        if (!match) {
            return new Date(now - 7 * 24 * 60 * 60 * 1000); // Default 7 dias
        }
        
        const [, amount, unit] = match;
        const value = parseInt(amount);
        
        switch (unit) {
            case 'h': return new Date(now - value * 60 * 60 * 1000);
            case 'd': return new Date(now - value * 24 * 60 * 60 * 1000);
            case 'w': return new Date(now - value * 7 * 24 * 60 * 60 * 1000);
            case 'm': return new Date(now.setMonth(now.getMonth() - value));
            case 'y': return new Date(now.setFullYear(now.getFullYear() - value));
            default: return new Date(now - 7 * 24 * 60 * 60 * 1000);
        }
    }
}

module.exports = new MetricsService();