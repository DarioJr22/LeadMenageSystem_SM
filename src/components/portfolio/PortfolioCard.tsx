import { Star, Edit2, Trash2, Calendar, User } from 'lucide-react';
import { type PortfolioItem, getCategoriaColor } from '../../services/portfolioApi';

interface PortfolioCardProps {
  projeto: PortfolioItem;
  onProjetoClick: (projeto: PortfolioItem) => void;
  onEdit: (projeto: PortfolioItem) => void;
  onDelete: (projetoId: string) => void;
}

export function PortfolioCard({ projeto, onProjetoClick, onEdit, onDelete }: PortfolioCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir o projeto "${projeto.titulo}"?`)) {
      onDelete(projeto.id);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer">
      {/* Imagem */}
      <div
        onClick={() => onProjetoClick(projeto)}
        className="relative h-48 bg-gray-200 overflow-hidden"
      >
        {projeto.imagemPrincipal ? (
          <img
            src={projeto.imagemPrincipal}
            alt={projeto.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}

        {/* Badge Destaque */}
        {projeto.destaque && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            <span>Destaque</span>
          </div>
        )}

        {/* Overlay com ações */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProjetoClick(projeto);
            }}
            className="px-3 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Ver Detalhes
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(projeto);
            }}
            className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            title="Editar"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div onClick={() => onProjetoClick(projeto)} className="p-4">
        <div className="mb-2">
          <span className={`inline-block px-2 py-1 rounded ${getCategoriaColor(projeto.categoria)}`}>
            {projeto.categoria}
          </span>
        </div>

        <h4 className="text-gray-900 mb-2 line-clamp-2">{projeto.titulo}</h4>

        <p className="text-gray-600 line-clamp-3 mb-3">{projeto.descricao}</p>

        {/* Tags */}
        {projeto.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {projeto.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
              >
                #{tag}
              </span>
            ))}
            {projeto.tags.length > 3 && (
              <span className="inline-block px-2 py-0.5 text-gray-500">
                +{projeto.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(projeto.dataRealizacao).toLocaleDateString('pt-BR')}</span>
          </div>
          {projeto.cliente && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span className="truncate max-w-[120px]">{projeto.cliente.nome}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
