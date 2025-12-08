import { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { portfolioApiService, type PortfolioItem, CATEGORIAS } from '../services/portfolioApi';
import { toast } from 'sonner@2.0.3';
import { DestaquesSection } from './portfolio/DestaquesSection';
import { CategoryFilter } from './portfolio/CategoryFilter';
import { PortfolioGrid } from './portfolio/PortfolioGrid';
import { PortfolioDetailModal } from './portfolio/PortfolioDetailModal';
import { PortfolioFormModal } from './portfolio/PortfolioFormModal';

export function Portfolio() {
  const [projetos, setProjetos] = useState<PortfolioItem[]>([]);
  const [destaques, setDestaques] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedProjeto, setSelectedProjeto] = useState<PortfolioItem | null>(null);
  const [editingProjeto, setEditingProjeto] = useState<PortfolioItem | null>(null);

  const fetchData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      else setLoading(true);

      const [projetosRes, destaquesRes] = await Promise.all([
        portfolioApiService.getAll().catch(() => ({ data: [] })),
        portfolioApiService.getDestaques().catch(() => ({ data: [] })),
      ]);

      setProjetos(projetosRes.data);
      setDestaques(destaquesRes.data);

      if (showToast) {
        toast.success('Portfólio atualizado!');
      }
    } catch (error) {
      console.error('Erro ao buscar portfólio:', error);
      toast.error('Erro ao carregar portfólio');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fetch por categoria
  const fetchByCategoria = async (categoria: string) => {
    try {
      setLoading(true);
      const response = await portfolioApiService.getByCategoria(categoria);
      setProjetos(response.data);
    } catch (error) {
      console.error('Erro ao filtrar por categoria:', error);
      toast.error('Erro ao filtrar projetos');
    } finally {
      setLoading(false);
    }
  };

  // Handle categoria filter
  const handleCategoriaChange = (categoria: string | null) => {
    setSelectedCategoria(categoria);
    if (categoria) {
      fetchByCategoria(categoria);
    } else {
      fetchData();
    }
  };

  // Filtrar projetos por busca
  const projetosFiltrados = useMemo(() => {
    if (!searchTerm) return projetos;

    const term = searchTerm.toLowerCase();
    return projetos.filter(
      (projeto) =>
        projeto.titulo.toLowerCase().includes(term) ||
        projeto.descricao.toLowerCase().includes(term) ||
        projeto.categoria.toLowerCase().includes(term) ||
        projeto.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  }, [projetos, searchTerm]);

  const handleNewProjeto = (projeto: PortfolioItem) => {
    setProjetos((prev) => [projeto, ...prev]);
    if (projeto.destaque) {
      setDestaques((prev) => [projeto, ...prev]);
    }
  };

  const handleUpdateProjeto = (projeto: PortfolioItem) => {
    setProjetos((prev) => prev.map((p) => (p.id === projeto.id ? projeto : p)));
    setDestaques((prev) => prev.map((p) => (p.id === projeto.id ? projeto : p)));
  };

  const handleDeleteProjeto = (projetoId: string) => {
    setProjetos((prev) => prev.filter((p) => p.id !== projetoId));
    setDestaques((prev) => prev.filter((p) => p.id !== projetoId));
  };

  const handleEdit = (projeto: PortfolioItem) => {
    setEditingProjeto(projeto);
    setShowFormModal(true);
    setSelectedProjeto(null);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingProjeto(null);
  };

  if (loading && projetos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Carregando portfólio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900">Portfólio</h2>
          <p className="text-gray-600">
            {projetos.length} {projetos.length === 1 ? 'projeto' : 'projetos'} no total
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar projetos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            Atualizar
          </button>

          <button
            onClick={() => setShowFormModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categorias={CATEGORIAS}
        selectedCategoria={selectedCategoria}
        onCategoriaChange={handleCategoriaChange}
        projetos={projetos}
      />

      {/* Destaques Section */}
      {destaques.length > 0 && !selectedCategoria && !searchTerm && (
        <DestaquesSection
          destaques={destaques}
          onProjetoClick={setSelectedProjeto}
          onEdit={handleEdit}
        />
      )}

      {/* Grid de Projetos */}
      <div>
        <h3 className="text-gray-900 mb-4">
          {selectedCategoria ? `Categoria: ${selectedCategoria}` : 'Todos os Projetos'}
        </h3>
        
        <PortfolioGrid
          projetos={projetosFiltrados}
          onProjetoClick={setSelectedProjeto}
          onEdit={handleEdit}
          onDelete={handleDeleteProjeto}
          loading={loading}
        />
      </div>

      {/* Modals */}
      {selectedProjeto && (
        <PortfolioDetailModal
          projeto={selectedProjeto}
          allProjetos={projetos}
          onClose={() => setSelectedProjeto(null)}
          onEdit={handleEdit}
          onDelete={handleDeleteProjeto}
          onNavigate={setSelectedProjeto}
        />
      )}

      {showFormModal && (
        <PortfolioFormModal
          projeto={editingProjeto}
          onClose={handleCloseForm}
          onSuccess={(projeto) => {
            if (editingProjeto) {
              handleUpdateProjeto(projeto);
            } else {
              handleNewProjeto(projeto);
            }
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
}
