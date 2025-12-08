import { useState } from 'react';
import { X } from 'lucide-react';
import { type Agendamento, type Lead, agendamentosApi } from '../../services/api';
import { toast } from 'sonner@2.0.3';

interface NewAgendamentoModalProps {
  leads: Lead[];
  onClose: () => void;
  onSuccess: (agendamento: Agendamento) => void;
}

export function NewAgendamentoModal({ leads, onClose, onSuccess }: NewAgendamentoModalProps) {
  const [isSaving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    leadId: leads.length > 0 ? leads[0].id : 0,
    titulo: '',
    descricao: '',
    dataHora: '',
    tipo: 'REUNIAO' as Agendamento['tipo'],
    status: 'AGENDADO' as Agendamento['status'],
    observacoes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leadId || !formData.titulo || !formData.dataHora) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const response = await agendamentosApi.create(formData);
      onSuccess(response.data);
      toast.success('Agendamento criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Erro ao criar agendamento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-gray-900">Novo Agendamento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Lead <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.leadId}
              onChange={(e) => setFormData({ ...formData, leadId: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.nome} {lead.empresa ? `- ${lead.empresa}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ex: Reunião de apresentação"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Data e Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.dataHora}
                onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tipo</label>
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
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Agendamento['status'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="AGENDADO">Agendado</option>
              <option value="REALIZADO">Realizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Descrição do agendamento"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Notas adicionais"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Criando...' : 'Criar Agendamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
