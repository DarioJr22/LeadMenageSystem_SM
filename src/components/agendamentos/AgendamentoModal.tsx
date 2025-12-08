import { useState } from 'react';
import { X, Edit2, Trash2, Save } from 'lucide-react';
import { type Agendamento, type Lead, agendamentosApi } from '../../services/api';
import { toast } from 'sonner@2.0.3';

interface AgendamentoModalProps {
  agendamento: Agendamento;
  leads: Lead[];
  onClose: () => void;
  onUpdate: (agendamento: Agendamento) => void;
  onDelete: (agendamentoId: number) => void;
}

export function AgendamentoModal({ agendamento, leads, onClose, onUpdate, onDelete }: AgendamentoModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    leadId: agendamento.leadId,
    titulo: agendamento.titulo,
    descricao: agendamento.descricao || '',
    dataHora: agendamento.dataHora.slice(0, 16), // Format for datetime-local input
    tipo: agendamento.tipo,
    status: agendamento.status,
    observacoes: agendamento.observacoes || '',
  });

  const getLeadName = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    return lead?.nome || 'Lead não encontrado';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await agendamentosApi.update(agendamento.id, formData);
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Agendamento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      toast.error('Erro ao atualizar agendamento');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    setIsDeleting(true);
    try {
      await agendamentosApi.delete(agendamento.id);
      onDelete(agendamento.id);
      toast.success('Agendamento excluído com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      toast.error('Erro ao excluir agendamento');
    } finally {
      setIsDeleting(false);
    }
  };

  const tipoLabels = {
    REUNIAO: 'Reunião',
    LIGACAO: 'Ligação',
    VISITA: 'Visita',
    APRESENTACAO: 'Apresentação',
    FOLLOW_UP: 'Follow-up',
  };

  const statusLabels = {
    AGENDADO: 'Agendado',
    REALIZADO: 'Realizado',
    CANCELADO: 'Cancelado',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-gray-900">Detalhes do Agendamento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Lead</label>
            {isEditing ? (
              <select
                value={formData.leadId}
                onChange={(e) => setFormData({ ...formData, leadId: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.nome} {lead.empresa ? `- ${lead.empresa}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900">{getLeadName(agendamento.leadId)}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Título</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-900">{agendamento.titulo}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Data e Hora</label>
              {isEditing ? (
                <input
                  type="datetime-local"
                  value={formData.dataHora}
                  onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-900">
                  {new Date(agendamento.dataHora).toLocaleString('pt-BR')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tipo</label>
              {isEditing ? (
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Agendamento['tipo'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="REUNIAO">Reunião</option>
                  <option value="LIGACAO">Ligação</option>
                  <option value="VISITA">Visita</option>
                  <option value="APRESENTACAO">Apresentação</option>
                  <option value="FOLLOW_UP">Follow-up</option>
                </select>
              ) : (
                <p className="text-gray-900">{tipoLabels[agendamento.tipo]}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            {isEditing ? (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Agendamento['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="AGENDADO">Agendado</option>
                <option value="REALIZADO">Realizado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            ) : (
              <p className="text-gray-900">{statusLabels[agendamento.status]}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Descrição</label>
            {isEditing ? (
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-900">{agendamento.descricao || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Observações</label>
            {isEditing ? (
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-900">{agendamento.observacoes || '-'}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 size={16} />
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
