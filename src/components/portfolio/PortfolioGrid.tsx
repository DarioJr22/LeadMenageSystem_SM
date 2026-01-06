import { Briefcase } from 'lucide-react';
import { type PortfolioItem } from '../../services/portfolioApi';
import { PortfolioCard } from './PortfolioCard';
import { portfolioApiService } from '../../services/portfolioApi';
import { toast } from 'sonner@2.0.3';

interface PortfolioGridProps {
  projetos: PortfolioItem[];
  onProjetoClick: (projeto: PortfolioItem) => void;
  onEdit: (projeto: PortfolioItem) => void;
  onDelete: (projetoId: string) => void;
  loading?: boolean;
}

export function PortfolioGrid({
  projetos,
  onProjetoClick,
  onEdit,
  onDelete,
  loading = false,
}: PortfolioGridProps) {
  const handleDelete = async (projetoId: number) => {
    try {
      await portfolioApiService.delete(projetoId);
      onDelete(projetoId);
      toast.success('Projeto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Estado vazio
  if (projetos.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
        <Briefcase className="text-gray-400 mx-auto mb-4" size={64} />
        <h3 className="text-gray-900 mb-2">Nenhum projeto encontrado</h3>
        <p className="text-gray-600 mb-6">
          Comece criando seu primeiro projeto de portfólio
        </p>
        <button
          onClick={() => {
            // Trigger new project modal from parent
            const event = new CustomEvent('openPortfolioForm');
            window.dispatchEvent(event);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Criar Primeiro Projeto
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projetos.map((projeto) => (
        <PortfolioCard
          key={projeto.id}
          projeto={projeto}
          onProjetoClick={onProjetoClick}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
