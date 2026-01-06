import { X } from 'lucide-react';
import { type Agendamento } from '../../services/api';

interface AgendamentoModalProps {
  agendamento: Agendamento;
  onClose: () => void;
}

export function AgendamentoModal({ agendamento, onClose }: AgendamentoModalProps) {
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
          {agendamento.titulo && (
            <div>
              <label className="block text-gray-700 mb-2">Título</label>
              <p className="text-gray-900">{agendamento.titulo}</p>
            </div>
          )}

          {agendamento.descricao && (
            <div>
              <label className="block text-gray-700 mb-2">Descrição</label>
              <p className="text-gray-900 whitespace-pre-wrap">{agendamento.descricao}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Data e Hora</label>
              <p className="text-gray-900">
                {new Date(agendamento.dataHora).toLocaleString('pt-BR')}
              </p>
            </div>

            {agendamento.duracaoMinutos && (
              <div>
                <label className="block text-gray-700 mb-2">Duração</label>
                <p className="text-gray-900">{agendamento.duracaoMinutos} minutos</p>
              </div>
            )}
          </div>

          {agendamento.tipoServico && (
            <div>
              <label className="block text-gray-700 mb-2">Tipo de Serviço</label>
              <p className="text-gray-900">{agendamento.tipoServico}</p>
            </div>
          )}

          {agendamento.status && (
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <p className="text-gray-900">{agendamento.status}</p>
            </div>
          )}

          {agendamento.observacoes && (
            <div>
              <label className="block text-gray-700 mb-2">Observações</label>
              <p className="text-gray-900 whitespace-pre-wrap">{agendamento.observacoes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
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
          {agendamento.titulo && (
            <div>
              <label className="block text-gray-700 mb-2">Título</label>
              <p className="text-gray-900">{agendamento.titulo}</p>
            </div>
          )}

          {agendamento.descricao && (
            <div>
              <label className="block text-gray-700 mb-2">Descrição</label>
              <p className="text-gray-900 whitespace-pre-wrap">{agendamento.descricao}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Data e Hora</label>
              <p className="text-gray-900">
                {new Date(agendamento.dataHora).toLocaleString('pt-BR')}
              </p>
            </div>

            {agendamento.duracaoMinutos && (
              <div>
                <label className="block text-gray-700 mb-2">Duração</label>
                <p className="text-gray-900">{agendamento.duracaoMinutos} minutos</p>
              </div>
            )}
          </div>

          {agendamento.tipoServico && (
            <div>
              <label className="block text-gray-700 mb-2">Tipo de Serviço</label>
              <p className="text-gray-900">{agendamento.tipoServico}</p>
            </div>
          )}

          {agendamento.status && (
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <p className="text-gray-900">{agendamento.status}</p>
            </div>
          )}

          {agendamento.observacoes && (
            <div>
              <label className="block text-gray-700 mb-2">Observações</label>
              <p className="text-gray-900 whitespace-pre-wrap">{agendamento.observacoes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
