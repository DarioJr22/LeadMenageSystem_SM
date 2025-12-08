import { useState, useEffect } from 'react';
import { Plus, RefreshCw, List, Calendar as CalendarIcon } from 'lucide-react';
import { agendamentosApi, leadsApi, type Agendamento, type Lead } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { AgendamentosList } from './agendamentos/AgendamentosList';
import { AgendamentosCalendar } from './agendamentos/AgendamentosCalendar';
import { NewAgendamentoModal } from './agendamentos/NewAgendamentoModal';
import { AgendamentoModal } from './agendamentos/AgendamentoModal';

type ViewMode = 'list' | 'calendar';

export function Agendamentos() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

  const fetchData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      const [agendamentosRes, leadsRes] = await Promise.all([
        agendamentosApi.getAll(),
        leadsApi.getAll(),
      ]);

      setAgendamentos(agendamentosRes.data);
      setLeads(leadsRes.data);

      if (showToast) {
        toast.success('Agendamentos atualizados!');
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.error('Erro ao carregar agendamentos');
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

  const handleNewAgendamento = (agendamento: Agendamento) => {
    setAgendamentos(prev => [agendamento, ...prev]);
  };

  const handleUpdateAgendamento = (agendamento: Agendamento) => {
    setAgendamentos(prev =>
      prev.map(a => (a.id === agendamento.id ? agendamento : a))
    );
  };

  const handleDeleteAgendamento = (agendamentoId: number) => {
    setAgendamentos(prev => prev.filter(a => a.id !== agendamentoId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">Agendamentos</h2>
            <p className="text-gray-600">
              {agendamentos.length} {agendamentos.length === 1 ? 'agendamento' : 'agendamentos'} no total
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle View */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}
                `}
              >
                <List size={20} />
                Lista
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${viewMode === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}
                `}
              >
                <CalendarIcon size={20} />
                Calendário
              </button>
            </div>

            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              Atualizar
            </button>

            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Novo Agendamento
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <AgendamentosList
          agendamentos={agendamentos}
          leads={leads}
          onAgendamentoClick={setSelectedAgendamento}
        />
      ) : (
        <AgendamentosCalendar
          agendamentos={agendamentos}
          leads={leads}
          onAgendamentoClick={setSelectedAgendamento}
        />
      )}

      {/* Modals */}
      {showNewModal && (
        <NewAgendamentoModal
          leads={leads}
          onClose={() => setShowNewModal(false)}
          onSuccess={handleNewAgendamento}
        />
      )}

      {selectedAgendamento && (
        <AgendamentoModal
          agendamento={selectedAgendamento}
          leads={leads}
          onClose={() => setSelectedAgendamento(null)}
          onUpdate={handleUpdateAgendamento}
          onDelete={handleDeleteAgendamento}
        />
      )}
    </div>
  );
}
