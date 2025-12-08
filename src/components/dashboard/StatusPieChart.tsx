import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusPieChartProps {
  leadsPorStatus: Record<string, number>;
}

const STATUS_LABELS: Record<string, string> = {
  'NOVO': 'Novo',
  'CONTATO_REALIZADO': 'Contato Realizado',
  'QUALIFICADO': 'Qualificado',
  'PROPOSTA_ENVIADA': 'Proposta Enviada',
  'NEGOCIACAO': 'Negociação',
  'CONVERTIDO': 'Convertido',
  'PERDIDO': 'Perdido',
};

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#6b7280'];

export function StatusPieChart({ leadsPorStatus }: StatusPieChartProps) {
  const data = Object.entries(leadsPorStatus).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
  }));

  // Se não houver dados, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-gray-900 mb-4">Distribuição por Status</h3>
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500">Nenhum lead cadastrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-gray-900 mb-4">Distribuição por Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
