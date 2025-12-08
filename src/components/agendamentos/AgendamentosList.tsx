import { useState } from 'react';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { type Agendamento, type Lead } from '../../services/api';

interface AgendamentosListProps {
  agendamentos: Agendamento[];
  leads: Lead[];
  onAgendamentoClick: (agendamento: Agendamento) => void;
}

type FilterStatus = 'all' | 'AGENDADO' | 'REALIZADO' | 'CANCELADO';
type FilterTipo = 'all' | 'REUNIAO' | 'LIGACAO' | 'VISITA' | 'APRESENTACAO' | 'FOLLOW_UP';

export function AgendamentosList({ agendamentos, leads, onAgendamentoClick }: AgendamentosListProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterTipo, setFilterTipo] = useState<FilterTipo>('all');

  const getLeadName = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    return lead?.nome || 'Lead não encontrado';
  };

  const isUpcoming = (dataHora: string) => {
    const agendamentoDate = new Date(dataHora);
    const now = new Date();
    const diffHours = (agendamentoDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  };

  const filteredAgendamentos = agendamentos
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .filter(a => filterTipo === 'all' || a.tipo === filterTipo)
    .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());

  const statusColors = {
    AGENDADO: 'bg-blue-100 text-blue-700',
    REALIZADO: 'bg-green-100 text-green-700',
    CANCELADO: 'bg-red-100 text-red-700',
  };

  const tipoLabels = {
    REUNIAO: 'Reunião',
    LIGACAO: 'Ligação',
    VISITA: 'Visita',
    APRESENTACAO: 'Apresentação',
    FOLLOW_UP: 'Follow-up',
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">Todos</option>
              <option value="AGENDADO">Agendado</option>
              <option value="REALIZADO">Realizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as FilterTipo)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">Todos</option>
              <option value="REUNIAO">Reunião</option>
              <option value="LIGACAO">Ligação</option>
              <option value="VISITA">Visita</option>
              <option value="APRESENTACAO">Apresentação</option>
              <option value="FOLLOW_UP">Follow-up</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista */}
      {filteredAgendamentos.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-500">Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAgendamentos.map(agendamento => {
            const upcoming = isUpcoming(agendamento.dataHora);
            
            return (
              <div
                key={agendamento.id}
                onClick={() => onAgendamentoClick(agendamento)}
                className={`
                  bg-white rounded-lg p-4 shadow-sm border cursor-pointer
                  hover:shadow-md transition-all
                  ${upcoming ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{agendamento.titulo}</h3>
                      {upcoming && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertCircle size={16} />
                          <span>Próximo</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={16} />
                        <span>{getLeadName(agendamento.leadId)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>
                          {new Date(agendamento.dataHora).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>
                          {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {agendamento.descricao && (
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {agendamento.descricao}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`px-3 py-1 rounded ${statusColors[agendamento.status]}`}>
                      {agendamento.status}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded">
                      {tipoLabels[agendamento.tipo]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
