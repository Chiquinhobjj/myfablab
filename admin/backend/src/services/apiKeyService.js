// API Key Service - Gerenciamento seguro de chaves de API
const crypto = require('crypto');
const { pool } = require('../config/database');
const { redis } = require('../config/redis');
const logger = require('../utils/logger');

class ApiKeyService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
    }

    // Criptografar chave de API
    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    // Descriptografar chave de API
    decrypt(encryptedData) {
        const decipher = crypto.createDecipheriv(
            this.algorithm, 
            this.secretKey, 
            Buffer.from(encryptedData.iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }

    // Criar nova chave de API
    async createApiKey(organizationId, userId, data) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Criptografar a chave
            const encryptedData = this.encrypt(data.apiKey);
            
            // Inserir no banco
            const query = `
                INSERT INTO api_keys (
                    organization_id, 
                    provider, 
                    key_name, 
                    encrypted_key,
                    encrypted_iv,
                    encrypted_auth_tag,
                    created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, key_name, provider, created_at
            `;
            
            const result = await client.query(query, [
                organizationId,
                data.provider,
                data.keyName,
                encryptedData.encrypted,
                encryptedData.iv,
                encryptedData.authTag,
                userId
            ]);
            
            // Log de auditoria
            await this.logAuditEvent(client, {
                organizationId,
                userId,
                action: 'api_key_created',
                resourceType: 'api_key',
                resourceId: result.rows[0].id,
                details: { provider: data.provider, keyName: data.keyName }
            });
            
            await client.query('COMMIT');
            
            // Invalidar cache
            await this.invalidateCache(organizationId);
            
            logger.info('API key created', {
                organizationId,
                provider: data.provider,
                keyId: result.rows[0].id
            });
            
            return result.rows[0];
            
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error creating API key', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Listar chaves de API
    async listApiKeys(organizationId, filters = {}) {
        const cacheKey = `api_keys:${organizationId}:${JSON.stringify(filters)}`;
        
        // Verificar cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        
        const query = `
            SELECT 
                id,
                provider,
                key_name,
                is_active,
                last_used,
                created_at,
                CASE 
                    WHEN LENGTH(encrypted_key) > 0 
                    THEN CONCAT(provider, '_****', SUBSTR(MD5(encrypted_key), 1, 4))
                    ELSE NULL 
                END as masked_key
            FROM api_keys
            WHERE organization_id = $1
                AND ($2::text IS NULL OR provider = $2)
                AND ($3::boolean IS NULL OR is_active = $3)
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [
            organizationId,
            filters.provider || null,
            filters.isActive !== undefined ? filters.isActive : null
        ]);
        
        // Cachear por 5 minutos
        await redis.setex(cacheKey, 300, JSON.stringify(result.rows));
        
        return result.rows;
    }

    // Testar chave de API
    async testApiKey(organizationId, keyId, userId) {
        const client = await pool.connect();
        
        try {
            // Buscar chave criptografada
            const keyQuery = `
                SELECT provider, encrypted_key, encrypted_iv, encrypted_auth_tag
                FROM api_keys
                WHERE id = $1 AND organization_id = $2 AND is_active = true
            `;
            
            const keyResult = await client.query(keyQuery, [keyId, organizationId]);
            
            if (keyResult.rows.length === 0) {
                throw new Error('API key not found or inactive');
            }
            
            const keyData = keyResult.rows[0];
            
            // Descriptografar
            const apiKey = this.decrypt({
                encrypted: keyData.encrypted_key,
                iv: keyData.encrypted_iv,
                authTag: keyData.encrypted_auth_tag
            });
            
            // Testar com o provedor
            const isValid = await this.testProviderConnection(keyData.provider, apiKey);
            
            // Atualizar last_used
            await client.query(
                'UPDATE api_keys SET last_used = NOW() WHERE id = $1',
                [keyId]
            );
            
            // Log de auditoria
            await this.logAuditEvent(client, {
                organizationId,
                userId,
                action: 'api_key_tested',
                resourceType: 'api_key',
                resourceId: keyId,
                details: { provider: keyData.provider, success: isValid }
            });
            
            return { valid: isValid, provider: keyData.provider };
            
        } catch (error) {
            logger.error('Error testing API key', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Testar conexão com provedor
    async testProviderConnection(provider, apiKey) {
        try {
            switch (provider) {
                case 'openai':
                    return await this.testOpenAI(apiKey);
                case 'anthropic':
                    return await this.testAnthropic(apiKey);
                case 'google':
                    return await this.testGoogle(apiKey);
                case 'openrouter':
                    return await this.testOpenRouter(apiKey);
                default:
                    throw new Error(`Unknown provider: ${provider}`);
            }
        } catch (error) {
            logger.error(`Provider test failed for ${provider}`, error);
            return false;
        }
    }

    // Testar OpenAI
    async testOpenAI(apiKey) {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        return response.ok;
    }

    // Testar Anthropic
    async testAnthropic(apiKey) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'Hi' }]
            })
        });
        
        return response.status !== 401;
    }

    // Testar Google
    async testGoogle(apiKey) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        
        return response.ok;
    }

    // Testar OpenRouter
    async testOpenRouter(apiKey) {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        return response.ok;
    }

    // Rotacionar chave de API
    async rotateApiKey(organizationId, keyId, newApiKey, userId) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Verificar se a chave pertence à organização
            const checkQuery = `
                SELECT id FROM api_keys 
                WHERE id = $1 AND organization_id = $2
            `;
            
            const checkResult = await client.query(checkQuery, [keyId, organizationId]);
            
            if (checkResult.rows.length === 0) {
                throw new Error('API key not found');
            }
            
            // Criptografar nova chave
            const encryptedData = this.encrypt(newApiKey);
            
            // Atualizar chave
            const updateQuery = `
                UPDATE api_keys
                SET encrypted_key = $1,
                    encrypted_iv = $2,
                    encrypted_auth_tag = $3,
                    rotated_at = NOW(),
                    rotated_by = $4
                WHERE id = $5
            `;
            
            await client.query(updateQuery, [
                encryptedData.encrypted,
                encryptedData.iv,
                encryptedData.authTag,
                userId,
                keyId
            ]);
            
            // Log de auditoria
            await this.logAuditEvent(client, {
                organizationId,
                userId,
                action: 'api_key_rotated',
                resourceType: 'api_key',
                resourceId: keyId
            });
            
            await client.query('COMMIT');
            
            // Invalidar cache
            await this.invalidateCache(organizationId);
            
            logger.info('API key rotated', { organizationId, keyId });
            
            return true;
            
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error rotating API key', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Deletar chave de API
    async deleteApiKey(organizationId, keyId, userId) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Soft delete
            const deleteQuery = `
                UPDATE api_keys
                SET is_active = false,
                    deleted_at = NOW(),
                    deleted_by = $1
                WHERE id = $2 AND organization_id = $3
                RETURNING provider, key_name
            `;
            
            const result = await client.query(deleteQuery, [userId, keyId, organizationId]);
            
            if (result.rows.length === 0) {
                throw new Error('API key not found');
            }
            
            // Log de auditoria
            await this.logAuditEvent(client, {
                organizationId,
                userId,
                action: 'api_key_deleted',
                resourceType: 'api_key',
                resourceId: keyId,
                details: result.rows[0]
            });
            
            await client.query('COMMIT');
            
            // Invalidar cache
            await this.invalidateCache(organizationId);
            
            logger.info('API key deleted', { organizationId, keyId });
            
            return true;
            
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error deleting API key', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Log de auditoria
    async logAuditEvent(client, event) {
        const query = `
            INSERT INTO audit_logs (
                organization_id,
                user_id,
                action,
                resource_type,
                resource_id,
                details,
                ip_address,
                user_agent
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
        
        await client.query(query, [
            event.organizationId,
            event.userId,
            event.action,
            event.resourceType,
            event.resourceId,
            JSON.stringify(event.details || {}),
            event.ipAddress || null,
            event.userAgent || null
        ]);
    }

    // Invalidar cache
    async invalidateCache(organizationId) {
        const pattern = `api_keys:${organizationId}:*`;
        const keys = await redis.keys(pattern);
        
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }

    // Obter chave descriptografada para uso interno
    async getDecryptedKey(organizationId, keyId) {
        const query = `
            SELECT provider, encrypted_key, encrypted_iv, encrypted_auth_tag
            FROM api_keys
            WHERE id = $1 AND organization_id = $2 AND is_active = true
        `;
        
        const result = await pool.query(query, [keyId, organizationId]);
        
        if (result.rows.length === 0) {
            throw new Error('API key not found or inactive');
        }
        
        const keyData = result.rows[0];
        
        const apiKey = this.decrypt({
            encrypted: keyData.encrypted_key,
            iv: keyData.encrypted_iv,
            authTag: keyData.encrypted_auth_tag
        });
        
        return {
            provider: keyData.provider,
            apiKey
        };
    }
}

module.exports = new ApiKeyService();