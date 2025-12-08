import { type PortfolioItem } from '../../services/portfolioApi';

interface CategoryFilterProps {
  categorias: Array<{ value: string; label: string; color: string }>;
  selectedCategoria: string | null;
  onCategoriaChange: (categoria: string | null) => void;
  projetos: PortfolioItem[];
}

export function CategoryFilter({
  categorias,
  selectedCategoria,
  onCategoriaChange,
  projetos,
}: CategoryFilterProps) {
  // Contar projetos por categoria
  const contadorPorCategoria = projetos.reduce((acc, projeto) => {
    acc[projeto.categoria] = (acc[projeto.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoriaChange(null)}
        className={`
          px-4 py-2 rounded-full transition-all
          ${
            selectedCategoria === null
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        Todos ({projetos.length})
      </button>

      {categorias.map((categoria) => {
        const count = contadorPorCategoria[categoria.value] || 0;
        const isSelected = selectedCategoria === categoria.value;

        return (
          <button
            key={categoria.value}
            onClick={() => onCategoriaChange(categoria.value)}
            className={`
              px-4 py-2 rounded-full transition-all
              ${
                isSelected
                  ? `${categoria.color} shadow-md ring-2 ring-offset-2 ring-blue-400`
                  : `${categoria.color} hover:shadow-md`
              }
            `}
          >
            {categoria.label} ({count})
          </button>
        );
      })}
    </div>
  );
}
