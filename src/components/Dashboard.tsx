import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  CalendarCheck, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { leadsApi, agendamentosApi, dashboardApi, type Lead, type Agendamento } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { StatCard } from './dashboard/StatCard';
import { LeadsChart } from './dashboard/LeadsChart';
import { StatusPieChart } from './dashboard/StatusPieChart';
import { AgendamentosBarChart } from './dashboard/AgendamentosBarChart';
import { CalendarioAgendamentos } from './dashboard/CalendarioAgendamentos';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsAtivos: 0,
    totalAgendamentos: 0,
    agendamentosHoje: 0,
    taxaConversao: 0,
    leadsPorStatus: {} as Record<string, number>,
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const fetchData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      // Buscar dados em paralelo
      const [statsRes, leadsRes, agendamentosRes] = await Promise.all([
        dashboardApi.getEstatisticas().catch(() => null),
        leadsApi.getAll().catch(() => ({ data: [] })),
        agendamentosApi.getAll().catch(() => ({ data: [] })),
      ]);

      if (statsRes) {
        setStats(statsRes.data);
      } else {
        // Calcular estatísticas manualmente se o endpoint não existir
        const leadsData = leadsRes.data;
        const agendamentosData = agendamentosRes.data;
        
        const hoje = new Date().toISOString().split('T')[0];
        const agendamentosHoje = agendamentosData.filter(
          a => a.dataHora.startsWith(hoje)
        ).length;

        const leadsPorStatus = leadsData.reduce((acc, lead) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const leadsConvertidos = leadsPorStatus['CONVERTIDO'] || 0;
        const taxaConversao = leadsData.length > 0 
          ? (leadsConvertidos / leadsData.length) * 100 
          : 0;

        setStats({
          totalLeads: leadsData.length,
          leadsAtivos: leadsData.filter(l => 
            !['CONVERTIDO', 'PERDIDO'].includes(l.status)
          ).length,
          totalAgendamentos: agendamentosData.length,
          agendamentosHoje,
          taxaConversao,
          leadsPorStatus,
        });
      }

      setLeads(leadsRes.data);
      setAgendamentos(agendamentosRes.data);

      if (showToast) {
        toast.success('Dados atualizados!');
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com botão de refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Visão geral do sistema</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total de Leads"
          value={stats.totalLeads}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Leads Ativos"
          value={stats.leadsAtivos}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Total Agendamentos"
          value={stats.totalAgendamentos}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Agendamentos Hoje"
          value={stats.agendamentosHoje}
          icon={CalendarCheck}
          color="orange"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.taxaConversao.toFixed(1)}%`}
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsChart leads={leads} />
        <StatusPieChart leadsPorStatus={stats.leadsPorStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AgendamentosBarChart agendamentos={agendamentos} />
      </div>

      {/* Calendário de Agendamentos */}
      <CalendarioAgendamentos agendamentos={agendamentos} />
    </div>
  );
}
