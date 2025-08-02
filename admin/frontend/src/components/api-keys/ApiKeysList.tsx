// API Keys Management Component
import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  TestTube,
  Clock,
  Activity
} from 'lucide-react';
import { useApiKeysStore } from '../../store/apiKeysStore';
import { AddApiKeyModal } from './AddApiKeyModal';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

interface ApiKey {
  id: string;
  provider: string;
  key_name: string;
  masked_key: string;
  is_active: boolean;
  last_used: string | null;
  created_at: string;
}

const providerColors = {
  openai: 'bg-green-500',
  anthropic: 'bg-orange-500',
  google: 'bg-blue-500',
  openrouter: 'bg-purple-500',
  mistral: 'bg-pink-500',
  deepseek: 'bg-indigo-500'
};

const providerLogos = {
  openai: '/logos/openai.svg',
  anthropic: '/logos/anthropic.svg',
  google: '/logos/google.svg',
  openrouter: '/logos/openrouter.svg',
  mistral: '/logos/mistral.svg',
  deepseek: '/logos/deepseek.svg'
};

export const ApiKeysList: React.FC = () => {
  const { apiKeys, fetchApiKeys, deleteApiKey, testApiKey, toggleApiKey } = useApiKeysStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [testingKeys, setTestingKeys] = useState<Set<string>>(new Set());
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set());
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const handleTestKey = async (keyId: string) => {
    setTestingKeys(prev => new Set(prev).add(keyId));
    
    try {
      const result = await testApiKey(keyId);
      if (result.valid) {
        toast.success('Chave de API válida e funcionando!');
      } else {
        toast.error('Chave de API inválida ou expirada');
      }
    } catch (error) {
      toast.error('Erro ao testar chave de API');
    } finally {
      setTestingKeys(prev => {
        const next = new Set(prev);
        next.delete(keyId);
        return next;
      });
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta chave de API?')) return;
    
    setDeletingKeys(prev => new Set(prev).add(keyId));
    
    try {
      await deleteApiKey(keyId);
      toast.success('Chave de API deletada com sucesso');
    } catch (error) {
      toast.error('Erro ao deletar chave de API');
    } finally {
      setDeletingKeys(prev => {
        const next = new Set(prev);
        next.delete(keyId);
        return next;
      });
    }
  };

  const handleToggleKey = async (keyId: string, currentStatus: boolean) => {
    try {
      await toggleApiKey(keyId, !currentStatus);
      toast.success(`Chave ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`);
    } catch (error) {
      toast.error('Erro ao alterar status da chave');
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success('Chave copiada para área de transferência');
    
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleShowKey = (keyId: string) => {
    setShowKeys(prev => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  };

  const ApiKeyCard: React.FC<{ apiKey: ApiKey }> = ({ apiKey }) => {
    const isDeleting = deletingKeys.has(apiKey.id);
    const isTesting = testingKeys.has(apiKey.id);
    const isKeyVisible = showKeys.has(apiKey.id);

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
        apiKey.is_active 
          ? 'border-gray-200 dark:border-gray-700' 
          : 'border-gray-300 dark:border-gray-600 opacity-60'
      } p-6 transition-all hover:shadow-md`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${providerColors[apiKey.provider] || 'bg-gray-500'} 
              flex items-center justify-center text-white font-bold text-sm`}>
              {apiKey.provider.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {apiKey.key_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {apiKey.provider}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleToggleKey(apiKey.id, apiKey.is_active)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                apiKey.is_active
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {apiKey.is_active ? 'Ativa' : 'Inativa'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* API Key Display */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 font-mono text-sm bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 
              text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>
                {isKeyVisible ? apiKey.masked_key.replace('****', '•••••••••••••••') : apiKey.masked_key}
              </span>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={() => toggleShowKey(apiKey.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {isKeyVisible ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => handleCopyKey(apiKey.masked_key)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {copiedKey === apiKey.masked_key ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>Criada em {formatDate(apiKey.created_at)}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Activity className="w-4 h-4 mr-1" />
              <span>
                {apiKey.last_used 
                  ? `Última vez: ${formatDate(apiKey.last_used)}`
                  : 'Nunca utilizada'
                }
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleTestKey(apiKey.id)}
              disabled={isTesting || !apiKey.is_active}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 
                text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 
                dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed"
            >
              {isTesting ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 mr-1" />
              )}
              Testar
            </button>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 
                text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 
                dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Rotacionar
            </button>
            
            <button
              onClick={() => handleDeleteKey(apiKey.id)}
              disabled={isDeleting}
              className="flex items-center px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 
                text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 
                dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              Deletar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProviderFilter: React.FC = () => {
    const providers = ['openai', 'anthropic', 'google', 'openrouter', 'mistral', 'deepseek'];
    
    return (
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedProvider(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            selectedProvider === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Todos
        </button>
        {providers.map(provider => (
          <button
            key={provider}
            onClick={() => setSelectedProvider(provider)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap capitalize ${
              selectedProvider === provider
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {provider}
          </button>
        ))}
      </div>
    );
  };

  const filteredKeys = selectedProvider 
    ? apiKeys.filter(key => key.provider === selectedProvider)
    : apiKeys;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chaves de API
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie as chaves de API dos provedores de IA
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg 
            hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Chave
        </button>
      </div>

      {/* Provider Filter */}
      <ProviderFilter />

      {/* API Keys Grid */}
      {filteredKeys.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
          dark:border-gray-700 p-12 text-center">
          <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhuma chave de API configurada
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Adicione chaves de API para começar a usar os modelos de IA
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              transition-colors inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar primeira chave
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredKeys.map(apiKey => (
            <ApiKeyCard key={apiKey.id} apiKey={apiKey} />
          ))}
        </div>
      )}

      {/* Add API Key Modal */}
      <AddApiKeyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchApiKeys();
        }}
      />
    </div>
  );
};