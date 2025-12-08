import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { type Lead } from '../../services/api';

interface LeadsChartProps {
  leads: Lead[];
}

export function LeadsChart({ leads }: LeadsChartProps) {
  // Agrupar leads por data
  const chartData = leads.reduce((acc, lead) => {
    const date = new Date(lead.dataCriacao).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
    
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.leads += 1;
    } else {
      acc.push({ date, leads: 1 });
    }
    
    return acc;
  }, [] as { date: string; leads: number }[]);

  // Ordenar por data e pegar últimos 14 dias
  const sortedData = chartData
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-14);

  // Se não houver dados, mostrar dados de exemplo
  const data = sortedData.length > 0 ? sortedData : [
    { date: 'Sem dados', leads: 0 }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-gray-900 mb-4">Evolução de Leads</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
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
          <Line 
            type="monotone" 
            dataKey="leads" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Novos Leads"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
