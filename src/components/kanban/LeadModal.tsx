import { useState } from 'react';
import { X, Trash2, Phone, Mail, MessageSquare } from 'lucide-react';
import { type Lead, leadsApi } from '../../services/api';
import { toast } from 'sonner@2.0.3';

interface LeadModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (leadId: number) => void;
}

export function LeadModal({ lead, onClose, onUpdate, onDelete }: LeadModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;

    setIsDeleting(true);
    try {
      await leadsApi.delete(lead.id);
      onDelete(lead.id);
      toast.success('Lead excluído com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      toast.error('Erro ao excluir lead');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWhatsApp = () => {
    if (lead.telefone) {
      const number = lead.telefone.replace(/\D/g, '');
      window.open(`https://wa.me/55${number}`, '_blank');
    } else {
      toast.error('Telefone não disponível');
    }
  };

  const handleEmail = () => {
    window.open(`mailto:${lead.email}`, '_blank');
  };

  const handleCall = () => {
    if (lead.telefone) {
      window.open(`tel:${lead.telefone}`, '_blank');
    } else {
      toast.error('Telefone não disponível');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-gray-900">Detalhes do Lead</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ações rápidas */}
          <div className="flex gap-2">
              <button
                onClick={handleCall}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone size={16} />
                Ligar
              </button>
              <button
                onClick={handleEmail}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail size={16} />
                Email
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <MessageSquare size={16} />
                WhatsApp
              </button>
            </div>

          {/* Dados do Lead */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nome</label>
              <p className="text-gray-900">{lead.nome}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <p className="text-gray-900">{lead.email}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Telefone</label>
                <p className="text-gray-900">{lead.telefone || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Empresa</label>
                <p className="text-gray-900">{lead.empresa || '-'}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Origem</label>
                <p className="text-gray-900">{lead.origem || '-'}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Serviços de Interesse</label>
              <div className="flex flex-wrap gap-2">
                {lead.servicos && lead.servicos.length > 0 ? (
                  lead.servicos.map((servico, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {servico}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-900">-</p>
                )}
              </div>
            </div>

            {(lead.orcamentoMin || lead.orcamentoMax) && (
              <div className="grid grid-cols-2 gap-4">
                {lead.orcamentoMin && (
                  <div>
                    <label className="block text-gray-700 mb-2">Orçamento Mínimo</label>
                    <p className="text-gray-900">R$ {lead.orcamentoMin.toFixed(2)}</p>
                  </div>
                )}
                {lead.orcamentoMax && (
                  <div>
                    <label className="block text-gray-700 mb-2">Orçamento Máximo</label>
                    <p className="text-gray-900">R$ {lead.orcamentoMax.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}

            {lead.mensagem && (
              <div>
                <label className="block text-gray-700 mb-2">Mensagem</label>
                <p className="text-gray-900 whitespace-pre-wrap">{lead.mensagem}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {lead.prioridade && (
                <div>
                  <label className="block text-gray-700 mb-2">Prioridade</label>
                  <p className="text-gray-900">{lead.prioridade}</p>
                </div>
              )}

              {lead.status && (
                <div>
                  <label className="block text-gray-700 mb-2">Status</label>
                  <p className="text-gray-900">{lead.status.replace(/_/g, ' ')}</p>
                </div>
              )}
            </div>

            {lead.createdAt && (
              <div>
                <label className="block text-gray-700 mb-2">Data de Criação</label>
                <p className="text-gray-900">
                  {new Date(lead.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Excluindo...' : 'Excluir Lead'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
