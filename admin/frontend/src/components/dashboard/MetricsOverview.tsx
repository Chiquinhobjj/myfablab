// Dashboard Metrics Overview Component
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Users, 
  AlertCircle,
  Zap,
  Clock
} from 'lucide-react';
import { useMetricsStore } from '../../store/metricsStore';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
}

export const MetricsOverview: React.FC = () => {
  const { overview, realtime, fetchOverview, fetchRealtimeMetrics } = useMetricsStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    
    // Atualizar métricas em tempo real a cada 5 segundos
    const realtimeInterval = setInterval(fetchRealtimeMetrics, 5000);
    
    // Atualizar overview a cada minuto
    const overviewInterval = setInterval(() => loadMetrics(), 60000);
    
    return () => {
      clearInterval(realtimeInterval);
      clearInterval(overviewInterval);
    };
  }, [timeRange]);

  const loadMetrics = async () => {
    setIsLoading(true);
    await fetchOverview(timeRange);
    setIsLoading(false);
  };

  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getMetricCards = (): MetricCard[] => {
    if (!overview?.summary) return [];

    const summary = overview.summary;
    const previousPeriodMultiplier = 0.9; // Simulação para demo

    return [
      {
        title: 'Total de Requisições',
        value: formatNumber(summary.total_requests),
        change: calculateChange(summary.total_requests, summary.total_requests * previousPeriodMultiplier),
        changeType: 'positive',
        icon: <Activity className="w-5 h-5" />,
        subtitle: `${realtime?.requests_per_minute || 0} req/min`
      },
      {
        title: 'Tokens Utilizados',
        value: formatNumber(summary.total_tokens),
        change: calculateChange(summary.total_tokens, summary.total_tokens * previousPeriodMultiplier),
        changeType: 'positive',
        icon: <Zap className="w-5 h-5" />,
        subtitle: `${formatNumber(realtime?.tokens_per_minute || 0)} tokens/min`
      },
      {
        title: 'Custo Total',
        value: formatCurrency(summary.total_cost_cents / 100),
        change: calculateChange(summary.total_cost_cents, summary.total_cost_cents * previousPeriodMultiplier),
        changeType: summary.total_cost_cents > summary.total_cost_cents * previousPeriodMultiplier ? 'negative' : 'positive',
        icon: <DollarSign className="w-5 h-5" />,
        subtitle: 'Últimos ' + timeRange
      },
      {
        title: 'Usuários Ativos',
        value: formatNumber(summary.unique_users),
        change: calculateChange(summary.unique_users, Math.floor(summary.unique_users * 0.85)),
        changeType: 'positive',
        icon: <Users className="w-5 h-5" />,
        subtitle: `Em ${summary.active_days} dias`
      },
      {
        title: 'Latência Média',
        value: `${Math.round(summary.avg_latency_ms)}ms`,
        change: calculateChange(summary.avg_latency_ms, summary.avg_latency_ms * 1.1),
        changeType: summary.avg_latency_ms < summary.avg_latency_ms * 1.1 ? 'positive' : 'negative',
        icon: <Clock className="w-5 h-5" />,
        subtitle: `Tempo real: ${realtime?.average_latency_ms || 0}ms`
      },
      {
        title: 'Taxa de Erro',
        value: formatPercentage((summary.error_count / summary.total_requests) * 100),
        change: calculateChange(summary.error_count, Math.floor(summary.error_count * 1.2)),
        changeType: summary.error_count < Math.floor(summary.error_count * 1.2) ? 'positive' : 'negative',
        icon: <AlertCircle className="w-5 h-5" />,
        subtitle: `${summary.error_count} erros total`
      }
    ];
  };

  const MetricCard: React.FC<MetricCard> = ({ title, value, change, changeType, icon, subtitle }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-500 dark:text-gray-400">{icon}</div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 
            'text-gray-500'
          }`}>
            {changeType === 'positive' ? <TrendingUp className="w-4 h-4 mr-1" /> : 
             changeType === 'negative' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">{subtitle}</div>
      )}
    </div>
  );

  const HourlyChart: React.FC = () => {
    if (!overview?.hourly_data || overview.hourly_data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Sem dados disponíveis
        </div>
      );
    }

    const chartData = overview.hourly_data.map(item => ({
      time: new Date(item.timestamp).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      requests: item.requests,
      tokens: item.tokens
    }));

    return (
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="time" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="requests" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorRequests)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const TopModels: React.FC = () => {
    if (!overview?.top_models || overview.top_models.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          Nenhum modelo utilizado ainda
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {overview.top_models.map((model, index) => (
          <div key={`${model.model_id}-${index}`} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {model.model_id}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                {model.provider}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatNumber(model.usage_count)} usos
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatNumber(model.tokens_used)} tokens
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const RealtimeStatus: React.FC = () => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium opacity-90">Status em Tempo Real</span>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
          <span className="text-xs">Ao vivo</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold">{realtime?.requests_per_minute || 0}</div>
          <div className="text-xs opacity-75">requisições/min</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{realtime?.average_latency_ms || 0}ms</div>
          <div className="text-xs opacity-75">latência média</div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Visão Geral de Métricas
        </h2>
        <div className="flex items-center space-x-2">
          {['24h', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getMetricCards().map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>

      {/* Charts and Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Uso por Hora
          </h3>
          <HourlyChart />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Realtime Status */}
          <RealtimeStatus />

          {/* Top Models */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Modelos Mais Usados
            </h3>
            <TopModels />
          </div>
        </div>
      </div>
    </div>
  );
};