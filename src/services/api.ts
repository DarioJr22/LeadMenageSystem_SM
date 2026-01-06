import axios from 'axios';

const API_BASE_URL = 'https://seumarketing-api-production.up.railway.app/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types - Based on Swagger API Documentation
export interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  mensagem?: string;
  servicos: string[]; // Required - Lista de serviços de interesse
  orcamentoMin?: number;
  orcamentoMax?: number;
  origem?: string;
  landingPageId?: number;
  status?: string; // Status do lead (tipo string conforme Swagger)
  prioridade?: string; // Prioridade do lead
  createdAt?: string;
}

export interface AgendamentoRequest {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  mensagem?: string;
  servicos: string[]; // Required
  orcamentoMin?: number;
  orcamentoMax?: number;
  dataAgendamento: string; // Required - formato: yyyy-MM-dd
  horario: string; // Required - formato: HH:mm
  preferencia?: string; // whatsapp ou meet
}

export interface Agendamento {
  id: number;
  titulo?: string;
  descricao?: string;
  tipoServico?: string;
  dataHora: string;
  duracaoMinutos?: number;
  status?: string;
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

// Leads API - Endpoints conforme Swagger
export const leadsApi = {
  // GET /api/leads - Listar todos os leads
  getAll: () => api.get<Lead[]>('/leads'),
  
  // GET /api/leads/{id} - Buscar lead por ID
  getById: (id: number) => api.get<Lead>(`/leads/${id}`),
  
  // POST /api/leads - Criar lead
  create: (lead: Omit<Lead, 'id' | 'createdAt'>) => api.post<Lead>('/leads', lead),
  
  // DELETE /api/leads/{id} - Deletar lead
  delete: (id: number) => api.delete(`/leads/${id}`),
  
  // PATCH /api/leads/{id}/status?status={status} - Atualizar status do lead
  updateStatus: (id: number, status: string) => 
    api.patch<Lead>(`/leads/${id}/status`, null, { params: { status } }),
  
  // GET /api/leads/status/{status} - Buscar leads por status
  getByStatus: (status: string) => api.get<Lead[]>(`/leads/status/${status}`),
  
  // GET /api/leads/prioridade/{prioridade} - Buscar leads por prioridade
  getByPrioridade: (prioridade: string) => api.get<Lead[]>(`/leads/prioridade/${prioridade}`),
};

// Agendamentos API - Endpoints conforme Swagger
export const agendamentosApi = {
  // GET /api/agendamentos - Listar todos os agendamentos
  getAll: () => api.get<Agendamento[]>('/agendamentos'),
  
  // GET /api/agendamentos/{id} - Buscar agendamento por ID
  getById: (id: number) => api.get<Agendamento>(`/agendamentos/${id}`),
  
  // POST /api/agendamentos/agendar - Agendar consultoria
  agendar: (agendamento: AgendamentoRequest) => 
    api.post<Agendamento>('/agendamentos/agendar', agendamento),
};

// Dashboard API - Não especificado no Swagger (mantido para compatibilidade)
export const dashboardApi = {
  getEstatisticas: () => api.get<Estatisticas>('/dashboard/estatisticas'),
};
