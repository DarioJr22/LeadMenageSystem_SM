import axios from 'axios';

const API_BASE_URL = 'https://seumarketing-api-production.up.railway.app/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  status: 'NOVO' | 'CONTATO_REALIZADO' | 'QUALIFICADO' | 'PROPOSTA_ENVIADA' | 'NEGOCIACAO' | 'CONVERTIDO' | 'PERDIDO';
  origem?: string;
  responsavel?: string;
  dataCriacao: string;
  ultimaInteracao?: string;
  observacoes?: string;
}

export interface Agendamento {
  id: number;
  leadId: number;
  leadNome?: string;
  titulo: string;
  descricao?: string;
  dataHora: string;
  tipo: 'REUNIAO' | 'LIGACAO' | 'VISITA' | 'APRESENTACAO' | 'FOLLOW_UP';
  status: 'AGENDADO' | 'REALIZADO' | 'CANCELADO';
  observacoes?: string;
}

export interface Estatisticas {
  totalLeads: number;
  leadsAtivos: number;
  totalAgendamentos: number;
  agendamentosHoje: number;
  taxaConversao: number;
  leadsPorStatus: Record<string, number>;
}

// Leads API
export const leadsApi = {
  getAll: () => api.get<Lead[]>('/leads'),
  getById: (id: number) => api.get<Lead>(`/leads/${id}`),
  create: (lead: Omit<Lead, 'id' | 'dataCriacao'>) => api.post<Lead>('/leads', lead),
  update: (id: number, lead: Partial<Lead>) => api.put<Lead>(`/leads/${id}`, lead),
  delete: (id: number) => api.delete(`/leads/${id}`),
  updateStatus: (id: number, status: Lead['status']) => 
    api.patch<Lead>(`/leads/${id}/status`, { status }),
  getByStatus: () => api.get<Record<string, Lead[]>>('/leads/por-status'),
};

// Agendamentos API
export const agendamentosApi = {
  getAll: () => api.get<Agendamento[]>('/agendamentos'),
  getById: (id: number) => api.get<Agendamento>(`/agendamentos/${id}`),
  create: (agendamento: Omit<Agendamento, 'id'>) => 
    api.post<Agendamento>('/agendamentos', agendamento),
  update: (id: number, agendamento: Partial<Agendamento>) => 
    api.put<Agendamento>(`/agendamentos/${id}`, agendamento),
  delete: (id: number) => api.delete(`/agendamentos/${id}`),
  getProximos: () => api.get<Agendamento[]>('/agendamentos/proximos'),
  getByPeriodo: (inicio: string, fim: string) => 
    api.get<Agendamento[]>(`/agendamentos/por-periodo?inicio=${inicio}&fim=${fim}`),
};

// Dashboard API
export const dashboardApi = {
  getEstatisticas: () => api.get<Estatisticas>('/dashboard/estatisticas'),
};
