import { useState } from 'react';
import {
  X,
  Edit2,
  Trash2,
  Calendar,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  Share2,
  Copy,
} from 'lucide-react';
import { type PortfolioItem, getCategoriaColor, portfolioApiService } from '../../services/portfolioApi';
import { toast } from 'sonner@2.0.3';

interface PortfolioDetailModalProps {
  projeto: PortfolioItem;
  allProjetos: PortfolioItem[];
  onClose: () => void;
  onEdit: (projeto: PortfolioItem) => void;
  onDelete: (projetoId: number) => void;
  onNavigate: (projeto: PortfolioItem) => void;
}

export function PortfolioDetailModal({
  projeto,
  allProjetos,
  onClose,
  onEdit,
  onDelete,
  onNavigate,
}: PortfolioDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const images = projeto.imagens.length > 0 ? projeto.imagens : [projeto.imagemPrincipal];
  const currentIndex = allProjetos.findIndex((p) => p.id === projeto.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allProjetos.length - 1;

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o projeto "${projeto.titulo}"?`)) return;

    setIsDeleting(true);
    try {
      await portfolioApiService.delete(projeto.id);
      onDelete(projeto.id);
      toast.success('Projeto excluído com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(allProjetos[currentIndex - 1]);
      setCurrentImageIndex(0);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(allProjetos[currentIndex + 1]);
      setCurrentImageIndex(0);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/portfolio/${projeto.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado para a área de transferência!');
  };

  const handleShareWhatsApp = () => {
    const url = `${window.location.origin}/portfolio/${projeto.slug}`;
    const text = `Confira o projeto: ${projeto.titulo}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = `${window.location.origin}/portfolio/${projeto.slug}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X size={24} />
            Voltar
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copiar link"
            >
              <Copy size={20} />
            </button>

            <div className="relative group">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 size={20} />
              </button>
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:block">
                <button
                  onClick={handleShareWhatsApp}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  WhatsApp
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  LinkedIn
                </button>
              </div>
            </div>

            <button
              onClick={() => onEdit(projeto)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 size={20} />
              Editar
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} />
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>

        {/* Galeria de Imagens */}
        <div className="relative bg-gray-900">
          {images.length > 0 && images[currentImageIndex] ? (
            <img
              src={images[currentImageIndex]}
              alt={projeto.titulo}
              className="w-full h-96 object-contain"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-gray-400">
              Sem imagem disponível
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                }`}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Título e Badge */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-gray-900 mb-2">{projeto.titulo}</h2>
              <div className="flex items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded ${getCategoriaColor(projeto.categoria)}`}>
                  {projeto.categoria}
                </span>
                {projeto.destaque && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded">
                    <Star size={16} fill="currentColor" />
                    Destaque
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={20} />
              <div>
                <p className="text-gray-500">Data de Realização</p>
                <p>{new Date(projeto.dataRealizacao).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {projeto.cliente && (
              <div className="flex items-center gap-2 text-gray-700">
                <User size={20} />
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p>
                    {projeto.cliente.nome}
                    {projeto.cliente.empresa && ` - ${projeto.cliente.empresa}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <h3 className="text-gray-900 mb-2">Descrição Completa</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{projeto.descricao}</p>
          </div>

          {/* Tags */}
          {projeto.tags.length > 0 && (
            <div>
              <h3 className="text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {projeto.tags.map((tag, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Link Externo */}
          {projeto.linkExterno && (
            <div>
              <a
                href={projeto.linkExterno}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink size={20} />
                Visitar Site
              </a>
            </div>
          )}
        </div>

        {/* Footer - Navegação entre projetos */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Projeto Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo Projeto
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
