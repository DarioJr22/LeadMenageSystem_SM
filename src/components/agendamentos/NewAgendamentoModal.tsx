import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { type AgendamentoRequest, type Lead, agendamentosApi, type Agendamento } from '../../services/api';
import { toast } from 'sonner@2.0.3';

interface NewAgendamentoModalProps {
  leads: Lead[];
  onClose: () => void;
  onSuccess: (agendamento: Agendamento) => void;
}

export function NewAgendamentoModal({ leads, onClose, onSuccess }: NewAgendamentoModalProps) {
  const [isSaving, setSaving] = useState(false);
  const [selectedLead, setSelectedLead] = useState(leads.length > 0 ? leads[0] : null);
  const [formData, setFormData] = useState<AgendamentoRequest>({
    nome: leads.length > 0 ? leads[0].nome : '',
    email: leads.length > 0 ? leads[0].email : '',
    telefone: leads.length > 0 ? leads[0].telefone : '',
    empresa: leads.length > 0 ? leads[0].empresa : '',
    mensagem: '',
    servicos: leads.length > 0 ? leads[0].servicos || [] : [],
    orcamentoMin: undefined,
    orcamentoMax: undefined,
    dataAgendamento: '', // formato: yyyy-MM-dd
    horario: '', // formato: HH:mm
    preferencia: '',
  });
  const [servicoInput, setServicoInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.dataAgendamento || !formData.horario || formData.servicos.length === 0) {
      toast.error('Preencha os campos obrigatórios (nome, email, data, horário e pelo menos um serviço)');
      return;
    }

    setSaving(true);
    try {
      const response = await agendamentosApi.agendar(formData);
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
              Selecionar Lead (preenche automaticamente os dados)
            </label>
            <select
              value={selectedLead?.id || ''}
              onChange={(e) => {
                const lead = leads.find(l => l.id === Number(e.target.value));
                if (lead) {
                  setSelectedLead(lead);
                  setFormData({
                    ...formData,
                    nome: lead.nome,
                    email: lead.email,
                    telefone: lead.telefone || '',
                    empresa: lead.empresa || '',
                    servicos: lead.servicos || [],
                    orcamentoMin: lead.orcamentoMin,
                    orcamentoMax: lead.orcamentoMax,
                  });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.nome} {lead.empresa ? `- ${lead.empresa}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Telefone</label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Empresa</label>
              <input
                type="text"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Serviços de Interesse <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={servicoInput}
                onChange={(e) => setServicoInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (servicoInput.trim() && !formData.servicos.includes(servicoInput.trim())) {
                      setFormData({ ...formData, servicos: [...formData.servicos, servicoInput.trim()] });
                      setServicoInput('');
                    }
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Ex: Social Media, Design, Tráfego"
              />
              <button
                type="button"
                onClick={() => {
                  if (servicoInput.trim() && !formData.servicos.includes(servicoInput.trim())) {
                    setFormData({ ...formData, servicos: [...formData.servicos, servicoInput.trim()] });
                    setServicoInput('');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            {formData.servicos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.servicos.map((servico, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {servico}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, servicos: formData.servicos.filter((_, i) => i !== index) });
                      }}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dataAgendamento}
                onChange={(e) => setFormData({ ...formData, dataAgendamento: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Horário <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Preferência de Contato</label>
            <select
              value={formData.preferencia}
              onChange={(e) => setFormData({ ...formData, preferencia: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Selecione...</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="meet">Google Meet</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Orçamento Mínimo (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.orcamentoMin || ''}
                onChange={(e) => setFormData({ ...formData, orcamentoMin: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="500.00"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Orçamento Máximo (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.orcamentoMax || ''}
                onChange={(e) => setFormData({ ...formData, orcamentoMax: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="5000.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mensagem</label>
            <textarea
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Mensagem ou observações"
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
