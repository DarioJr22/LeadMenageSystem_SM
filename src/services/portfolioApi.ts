import axios from 'axios';

const API_BASE_URL = 'https://seumarketing-api-production.up.railway.app/api';

export const portfolioApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface PortfolioItem {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  categoria: string;
  cliente?: {
    id: string;
    nome: string;
    empresa?: string;
  };
  dataRealizacao: string;
  tags: string[];
  imagens: string[];
  imagemPrincipal: string;
  linkExterno?: string;
  destaque: boolean;
  status: 'ativo' | 'inativo';
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreatePortfolioDTO {
  titulo: string;
  slug: string;
  descricao: string;
  categoria: string;
  clienteId?: string;
  dataRealizacao?: string;
  tags?: string[];
  linkExterno?: string;
  destaque?: boolean;
  status?: 'ativo' | 'inativo';
}

export interface CreatePortfolioComImagensDTO extends CreatePortfolioDTO {
  imagens: string[];
}

// API Functions
export const portfolioApiService = {
  // Listagem e Consulta
  getAll: () => portfolioApi.get<PortfolioItem[]>('/portfolio'),
  
  getBySlug: (slug: string) => portfolioApi.get<PortfolioItem>(`/portfolio/${slug}`),
  
  getDestaques: () => portfolioApi.get<PortfolioItem[]>('/portfolio/destaques'),
  
  getByCategoria: (categoria: string) => 
    portfolioApi.get<PortfolioItem[]>(`/portfolio/categoria/${categoria}`),
  
  // Criação
  create: (data: CreatePortfolioDTO) => 
    portfolioApi.post<PortfolioItem>('/portfolio', data),
  
  createComImagens: (data: CreatePortfolioComImagensDTO) => 
    portfolioApi.post<PortfolioItem>('/portfolio/com-imagens', data),
  
  // Atualização (inferido, não especificado mas necessário)
  update: (id: string, data: Partial<CreatePortfolioDTO>) => 
    portfolioApi.put<PortfolioItem>(`/portfolio/${id}`, data),
  
  updateComImagens: (id: string, data: Partial<CreatePortfolioComImagensDTO>) => 
    portfolioApi.put<PortfolioItem>(`/portfolio/${id}/com-imagens`, data),
  
  // Exclusão (inferido)
  delete: (id: string) => portfolioApi.delete(`/portfolio/${id}`),
};

// Categorias predefinidas
export const CATEGORIAS = [
  { value: 'Web Design', label: 'Web Design', color: 'bg-blue-100 text-blue-700' },
  { value: 'Marketing Digital', label: 'Marketing Digital', color: 'bg-purple-100 text-purple-700' },
  { value: 'Branding & Identidade', label: 'Branding & Identidade', color: 'bg-pink-100 text-pink-700' },
  { value: 'Aplicativos Mobile', label: 'Aplicativos Mobile', color: 'bg-green-100 text-green-700' },
  { value: 'E-commerce', label: 'E-commerce', color: 'bg-orange-100 text-orange-700' },
  { value: 'Redes Sociais', label: 'Redes Sociais', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'Fotografia', label: 'Fotografia', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'Vídeo & Animação', label: 'Vídeo & Animação', color: 'bg-red-100 text-red-700' },
  { value: 'Consultoria', label: 'Consultoria', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Outros', label: 'Outros', color: 'bg-gray-100 text-gray-700' },
];

// Função auxiliar para gerar slug
export function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

// Função para obter cor da categoria
export function getCategoriaColor(categoria: string): string {
  const cat = CATEGORIAS.find(c => c.value === categoria);
  return cat?.color || 'bg-gray-100 text-gray-700';
}
