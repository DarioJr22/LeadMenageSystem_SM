import axios from 'axios';

const API_BASE_URL = 'https://seumarketing-api-production.up.railway.app/api';

export const portfolioApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types - Based on Swagger API Documentation
export interface PortfolioItem {
  id: number; // Long no backend
  titulo: string;
  slug: string;
  descricao?: string;
  categoria: string;
  cliente?: string;
  imagemCapa?: string;
  imagensGaleria?: string[];
  url?: string[]; // URLs relacionadas ao projeto
  resultado?: string;
  tags?: string[];
  destaque: boolean;
  ordem: number;
  ativo: boolean;
  createdAt?: string;
}

export interface CreatePortfolioDTO {
  titulo: string;
  slug?: string; // Será gerado automaticamente se não fornecido
  descricao?: string;
  categoria: string;
  cliente?: string;
  resultado?: string;
  tags?: string[];
  destaque?: boolean;
  ordem?: number;
  ativo?: boolean;
}

// API Functions - Endpoints conforme Swagger
export const portfolioApiService = {
  // GET /api/portfolio - Listar todos os itens do portfólio
  getAll: () => portfolioApi.get<PortfolioItem[]>('/portfolio'),
  
  // GET /api/portfolio/{slug} - Buscar item por slug
  getBySlug: (slug: string) => portfolioApi.get<PortfolioItem>(`/portfolio/${slug}`),
  
  // GET /api/portfolio/destaques - Listar itens em destaque
  getDestaques: () => portfolioApi.get<PortfolioItem[]>('/portfolio/destaques'),
  
  // GET /api/portfolio/categoria/{categoria} - Listar por categoria
  // Categorias: SOCIAL_MEDIA, DESIGN, AUDIOVISUAL, TRAFEGO
  getByCategoria: (categoria: string) => 
    portfolioApi.get<PortfolioItem[]>(`/portfolio/categoria/${categoria}`),
  
  // POST /api/portfolio - Criar novo item
  create: (data: CreatePortfolioDTO) => 
    portfolioApi.post<PortfolioItem>('/portfolio', data),
  
  // POST /api/portfolio/com-imagens - Criar item com URLs de imagens
  // Parâmetros via query string
  createComImagens: (params: {
    urlsImagens: string; // URLs separadas por vírgula
    titulo: string;
    descricao?: string;
    categoria: string;
    cliente?: string;
    resultado?: string;
    tags?: string; // Tags separadas por vírgula
    destaque?: boolean;
    ordem?: number;
  }) => portfolioApi.post<PortfolioItem>('/portfolio/com-imagens', null, { params }),
};

// Categorias conforme Swagger
export const CATEGORIAS_SWAGGER = [
  { value: 'SOCIAL_MEDIA', label: 'Social Media', color: 'bg-blue-100 text-blue-700' },
  { value: 'DESIGN', label: 'Design', color: 'bg-purple-100 text-purple-700' },
  { value: 'AUDIOVISUAL', label: 'Audiovisual', color: 'bg-pink-100 text-pink-700' },
  { value: 'TRAFEGO', label: 'Tráfego', color: 'bg-green-100 text-green-700' },
];

// Categorias antigas (mantidas para compatibilidade - deprecated)
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

// Função para obter cor da categoria (usa categorias do Swagger)
export function getCategoriaColor(categoria: string): string {
  const cat = CATEGORIAS_SWAGGER.find(c => c.value === categoria);
  return cat?.color || 'bg-gray-100 text-gray-700';
}
