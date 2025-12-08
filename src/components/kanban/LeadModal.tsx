import { useState } from 'react';
import { X, Edit2, Trash2, Save, Phone, Mail, MessageSquare } from 'lucide-react';
import { type Lead, leadsApi } from '../../services/api';
import { toast } from 'sonner@2.0.3';

interface LeadModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (leadId: number) => void;
}

export function LeadModal({ lead, onClose, onUpdate, onDelete }: LeadModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    nome: lead.nome,
    email: lead.email,
    telefone: lead.telefone,
    empresa: lead.empresa || '',
    origem: lead.origem || '',
    responsavel: lead.responsavel || '',
    observacoes: lead.observacoes || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await leadsApi.update(lead.id, formData);
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Lead atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      toast.error('Erro ao atualizar lead');
    } finally {
      setSaving(false);
    }
  };

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
    const number = lead.telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${number}`, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:${lead.email}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${lead.telefone}`, '_blank');
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
          {!isEditing && (
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
          )}

          {/* Formulário */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nome</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-900">{lead.nome}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{lead.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Telefone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{lead.telefone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Empresa</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{lead.empresa || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Origem</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.origem}
                    onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{lead.origem || '-'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Responsável</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-900">{lead.responsavel || '-'}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Observações</label>
              {isEditing ? (
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              ) : (
                <p className="text-gray-900">{lead.observacoes || '-'}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-gray-700 mb-2">Data de Criação</label>
                <p className="text-gray-900">
                  {new Date(lead.dataCriacao).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <p className="text-gray-900">{lead.status.replace(/_/g, ' ')}</p>
              </div>
            </div>
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
