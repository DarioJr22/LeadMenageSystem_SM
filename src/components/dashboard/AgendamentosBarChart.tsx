import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { type Agendamento } from '../../services/api';

interface AgendamentosBarChartProps {
  agendamentos: Agendamento[];
}

export function AgendamentosBarChart({ agendamentos }: AgendamentosBarChartProps) {
  // Agrupar agendamentos por semana
  const chartData = agendamentos.reduce((acc, agendamento) => {
    const date = new Date(agendamento.dataHora);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    
    const weekLabel = weekStart.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
    
    const existing = acc.find(item => item.semana === weekLabel);
    if (existing) {
      existing.total += 1;
      if (agendamento.status === 'AGENDADO') existing.agendados += 1;
      if (agendamento.status === 'REALIZADO') existing.realizados += 1;
      if (agendamento.status === 'CANCELADO') existing.cancelados += 1;
    } else {
      acc.push({
        semana: weekLabel,
        total: 1,
        agendados: agendamento.status === 'AGENDADO' ? 1 : 0,
        realizados: agendamento.status === 'REALIZADO' ? 1 : 0,
        cancelados: agendamento.status === 'CANCELADO' ? 1 : 0,
      });
    }
    
    return acc;
  }, [] as { semana: string; total: number; agendados: number; realizados: number; cancelados: number }[]);

  // Ordenar e pegar últimas 8 semanas
  const sortedData = chartData
    .sort((a, b) => {
      const dateA = new Date(a.semana);
      const dateB = new Date(b.semana);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-8);

  // Se não houver dados, mostrar dados de exemplo
  const data = sortedData.length > 0 ? sortedData : [
    { semana: 'Sem dados', total: 0, agendados: 0, realizados: 0, cancelados: 0 }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-gray-900 mb-4">Agendamentos por Semana</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="semana" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="agendados" fill="#3b82f6" name="Agendados" />
          <Bar dataKey="realizados" fill="#10b981" name="Realizados" />
          <Bar dataKey="cancelados" fill="#ef4444" name="Cancelados" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
