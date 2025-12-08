import { Star, Edit2 } from 'lucide-react';
import { type PortfolioItem, getCategoriaColor } from '../../services/portfolioApi';

interface DestaquesSectionProps {
  destaques: PortfolioItem[];
  onProjetoClick: (projeto: PortfolioItem) => void;
  onEdit: (projeto: PortfolioItem) => void;
}

export function DestaquesSection({ destaques, onProjetoClick, onEdit }: DestaquesSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-yellow-500" size={24} fill="currentColor" />
        <h3 className="text-gray-900">Projetos em Destaque</h3>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {destaques.map((projeto) => (
            <div
              key={projeto.id}
              className="group relative w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
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
                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={14} fill="currentColor" />
                  <span>Destaque</span>
                </div>

                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProjetoClick(projeto);
                    }}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(projeto);
                    }}
                    className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 size={20} />
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

                <div className="flex items-center justify-between text-gray-500">
                  <span>
                    {new Date(projeto.dataRealizacao).toLocaleDateString('pt-BR')}
                  </span>
                  {projeto.cliente && <span>{projeto.cliente.nome}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
