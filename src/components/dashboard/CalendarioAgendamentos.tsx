import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { type Agendamento } from '../../services/api';

interface CalendarioAgendamentosProps {
  agendamentos: Agendamento[];
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function CalendarioAgendamentos({ agendamentos }: CalendarioAgendamentosProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calcular dias do mês
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Criar array de dias
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Contar agendamentos por dia
  const agendamentosPorDia: Record<string, number> = {};
  agendamentos.forEach(agendamento => {
    const date = new Date(agendamento.dataHora);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    agendamentosPorDia[dateKey] = (agendamentosPorDia[dateKey] || 0) + 1;
  });

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
  };

  const getAgendamentosForDate = (date: Date) => {
    return agendamentos.filter(agendamento => {
      const agendamentoDate = new Date(agendamento.dataHora);
      return (
        agendamentoDate.getDate() === date.getDate() &&
        agendamentoDate.getMonth() === date.getMonth() &&
        agendamentoDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const selectedDayAgendamentos = selectedDate ? getAgendamentosForDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-gray-900 mb-4">Calendário de Agendamentos</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          {/* Header do calendário */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h4 className="text-gray-900">
              {MESES[month]} {year}
            </h4>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DIAS_SEMANA.map(dia => (
              <div key={dia} className="text-center text-gray-600 py-2">
                {dia}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const dateKey = `${year}-${month}-${day}`;
              const count = agendamentosPorDia[dateKey] || 0;
              const today = isToday(day);
              const selected = selectedDate?.getDate() === day;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative p-2 rounded-lg text-center transition-all
                    ${today ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}
                    ${selected ? 'ring-2 ring-blue-600' : ''}
                  `}
                >
                  <span>{day}</span>
                  {count > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de agendamentos do dia selecionado */}
        <div className="border-l border-gray-200 pl-6">
          <h4 className="text-gray-900 mb-4">
            {selectedDate ? (
              <>Agendamentos em {selectedDate.getDate()}/{selectedDate.getMonth() + 1}</>
            ) : (
              'Selecione um dia'
            )}
          </h4>

          {selectedDate ? (
            selectedDayAgendamentos.length > 0 ? (
              <div className="space-y-3">
                {selectedDayAgendamentos.map(agendamento => (
                  <div
                    key={agendamento.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Clock size={16} className="text-gray-600 mt-0.5" />
                      <span className="text-gray-900">
                        {new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    
                    <p className="text-gray-900 mb-1">
                      {agendamento.titulo}
                    </p>
                    
                    {agendamento.leadNome && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={14} />
                        <span>{agendamento.leadNome}</span>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <span className={`
                        inline-block px-2 py-1 rounded text-white
                        ${agendamento.status === 'AGENDADO' ? 'bg-blue-600' : ''}
                        ${agendamento.status === 'REALIZADO' ? 'bg-green-600' : ''}
                        ${agendamento.status === 'CANCELADO' ? 'bg-red-600' : ''}
                      `}>
                        {agendamento.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum agendamento neste dia</p>
            )
          ) : (
            <p className="text-gray-500">Clique em um dia para ver os agendamentos</p>
          )}
        </div>
      </div>
    </div>
  );
}
