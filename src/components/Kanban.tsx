import { useState, useEffect } from 'react';
import { Plus, Filter, RefreshCw } from 'lucide-react';
import { leadsApi, type Lead } from '../services/api';
import { toast } from 'sonner@2.0.3';
import { KanbanColumn } from './kanban/KanbanColumn';
import { LeadModal } from './kanban/LeadModal';
import { NewLeadModal } from './kanban/NewLeadModal';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { LeadCard } from './kanban/LeadCard';

const COLUMNS = [
  { id: 'NOVO', title: 'Novo', color: 'bg-blue-100' },
  { id: 'CONTATO_REALIZADO', title: 'Contato Realizado', color: 'bg-purple-100' },
  { id: 'QUALIFICADO', title: 'Qualificado', color: 'bg-green-100' },
  { id: 'PROPOSTA_ENVIADA', title: 'Proposta Enviada', color: 'bg-yellow-100' },
  { id: 'NEGOCIACAO', title: 'Negociação', color: 'bg-orange-100' },
  { id: 'CONVERTIDO', title: 'Convertido', color: 'bg-emerald-100' },
  { id: 'PERDIDO', title: 'Perdido', color: 'bg-red-100' },
];

export function Kanban() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchLeads = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      const response = await leadsApi.getAll();
      setLeads(response.data);

      if (showToast) {
        toast.success('Leads atualizados!');
      }
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast.error('Erro ao carregar leads');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchLeads();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    setActiveLead(lead || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as number;
    const newStatus = over.id as Lead['status'];
    
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Atualizar otimisticamente
    setLeads(prevLeads =>
      prevLeads.map(l =>
        l.id === leadId ? { ...l, status: newStatus } : l
      )
    );

    try {
      await leadsApi.updateStatus(leadId, newStatus);
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do lead');
      // Reverter mudança em caso de erro
      fetchLeads();
    }
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(prevLeads =>
      prevLeads.map(l => (l.id === updatedLead.id ? updatedLead : l))
    );
  };

  const handleLeadDelete = (leadId: number) => {
    setLeads(prevLeads => prevLeads.filter(l => l.id !== leadId));
  };

  const handleNewLead = (newLead: Lead) => {
    setLeads(prevLeads => [newLead, ...prevLeads]);
  };

  const getLeadsForColumn = (status: Lead['status']) => {
    return leads.filter(lead => lead.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Carregando leads...</p>
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
            <h2 className="text-gray-900">Kanban de Leads</h2>
            <p className="text-gray-600">
              {leads.length} {leads.length === 1 ? 'lead' : 'leads'} no total
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchLeads(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              Atualizar
            </button>
            
            <button
              onClick={() => setShowNewLeadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Novo Lead
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id as Lead['status']}
              title={column.title}
              color={column.color}
              leads={getLeadsForColumn(column.id as Lead['status'])}
              onLeadClick={handleLeadClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="rotate-3 opacity-80">
              <LeadCard lead={activeLead} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleLeadUpdate}
          onDelete={handleLeadDelete}
        />
      )}

      {showNewLeadModal && (
        <NewLeadModal
          onClose={() => setShowNewLeadModal(false)}
          onSuccess={handleNewLead}
        />
      )}
    </div>
  );
}
