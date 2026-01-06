import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  type PortfolioItem,
  portfolioApiService,
  CATEGORIAS_SWAGGER,
  generateSlug,
} from '../../services/portfolioApi';
import { leadsApi, type Lead } from '../../services/api';
import { toast } from 'sonner@2.0.3';

interface PortfolioFormModalProps {
  projeto?: PortfolioItem | null;
  onClose: () => void;
  onSuccess: (projeto: PortfolioItem) => void;
}

export function PortfolioFormModal({ projeto, onClose, onSuccess }: PortfolioFormModalProps) {
  const [isSaving, setSaving] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formData, setFormData] = useState({
    titulo: projeto?.titulo || '',
    slug: projeto?.slug || '',
    descricao: projeto?.descricao || '',
    categoria: projeto?.categoria || CATEGORIAS_SWAGGER[0].value,
    cliente: projeto?.cliente || '',
    resultado: projeto?.resultado || '',
    tags: projeto?.tags || [],
    imagens: [] as string[], // URLs das imagens
    destaque: projeto?.destaque || false,
    ordem: projeto?.ordem || 0,
  });
  const [tagInput, setTagInput] = useState('');
  const [imagemInput, setImagemInput] = useState('');

  useEffect(() => {
    // Buscar leads para o autocomplete de cliente
    leadsApi
      .getAll()
      .then((response) => setLeads(response.data))
      .catch((error) => console.error('Erro ao buscar leads:', error));
  }, []);

  // Auto-gerar slug ao digitar título
  useEffect(() => {
    if (!projeto && formData.titulo) {
      const newSlug = generateSlug(formData.titulo);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.titulo, projeto]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleAddImagem = () => {
    if (imagemInput.trim()) {
      // Validação básica de URL
      try {
        new URL(imagemInput);
        setFormData((prev) => ({
          ...prev,
          imagens: [...prev.imagens, imagemInput.trim()],
        }));
        setImagemInput('');
      } catch {
        toast.error('URL de imagem inválida');
      }
    }
  };

  const handleRemoveImagem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.titulo.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('O slug é obrigatório');
      return;
    }

    // Validar formato do slug
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error('O slug deve conter apenas letras minúsculas, números e hífens');
      return;
    }

    if (!formData.descricao.trim()) {
      toast.error('A descrição é obrigatória');
      return;
    }

    setSaving(true);
    try {
      // Payload conforme Swagger - createComImagens usa query params
      if (formData.imagens.length > 0) {
        const params = {
          urlsImagens: formData.imagens.join(','), // URLs separadas por vírgula
          titulo: formData.titulo,
          descricao: formData.descricao,
          categoria: formData.categoria,
          cliente: formData.cliente || undefined,
          resultado: formData.resultado || undefined,
          tags: formData.tags.join(','), // Tags separadas por vírgula
          destaque: formData.destaque,
          ordem: formData.ordem,
        };
        const response = await portfolioApiService.createComImagens(params);
        toast.success('Projeto criado com sucesso!');
        onSuccess(response.data);
      } else {
        // Criar sem imagens
        const payload = {
          titulo: formData.titulo,
          slug: formData.slug,
          descricao: formData.descricao,
          categoria: formData.categoria,
          cliente: formData.cliente || undefined,
          resultado: formData.resultado || undefined,
          tags: formData.tags,
          destaque: formData.destaque,
          ordem: formData.ordem,
        };
        const response = await portfolioApiService.create(payload);
        toast.success('Projeto criado com sucesso!');
        onSuccess(response.data);
      }
    } catch (error: any) {
      console.error('Erro ao salvar projeto:', error);
      if (error.response?.status === 409) {
        toast.error('Este slug já está em uso. Por favor, escolha outro.');
      } else {
        toast.error('Erro ao salvar projeto');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-gray-900">{projeto ? 'Editar Projeto' : 'Novo Projeto no Portfólio'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-gray-700 mb-2">
              Título do Projeto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ex: Redesign Site Empresa X"
              required
              maxLength={100}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-gray-700 mb-2">
              Slug (URL amigável) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="redesign-site-empresa-x"
              required
              pattern="[a-z0-9-]+"
            />
            <p className="text-gray-500 mt-1">
              💡 Gerado automaticamente, pode ser editado. Apenas letras minúsculas, números e hífens.
            </p>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-gray-700 mb-2">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              {CATEGORIAS_SWAGGER.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-gray-700 mb-2">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Descreva o projeto..."
              required
              maxLength={1000}
            />
            <p className="text-gray-500 mt-1">
              {formData.descricao.length}/1000 caracteres
            </p>
          </div>

          {/* Data e Cliente */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Data de Realização</label>
              <input
                type="date"
                value={formData.dataRealizacao}
                onChange={(e) => setFormData({ ...formData, dataRealizacao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Cliente (opcional)</label>
              <select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Selecionar lead...</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.nome} {lead.empresa ? `- ${lead.empresa}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Digite uma tag e pressione Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* URLs das Imagens */}
          <div>
            <label className="block text-gray-700 mb-2">URLs das Imagens</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imagemInput}
                onChange={(e) => setImagemInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImagem();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <button
                type="button"
                onClick={handleAddImagem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="text-gray-500 mb-2">💡 Cole as URLs das imagens do projeto</p>
            {formData.imagens.length > 0 && (
              <div className="space-y-2">
                {formData.imagens.map((imagem, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <img
                      src={imagem}
                      alt={`Preview ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '';
                        e.currentTarget.alt = 'Erro ao carregar';
                      }}
                    />
                    <span className="flex-1 text-gray-700 truncate">{imagem}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImagem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Link Externo */}
          <div>
            <label className="block text-gray-700 mb-2">Link Externo (opcional)</label>
            <input
              type="url"
              value={formData.linkExterno}
              onChange={(e) => setFormData({ ...formData, linkExterno: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://exemplo.com"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.destaque}
                onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Marcar como Destaque</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === 'ativo'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked ? 'ativo' : 'inativo' })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Publicar imediatamente</span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : projeto ? 'Salvar Alterações' : 'Salvar Projeto'}
          </button>
        </div>
      </div>
    </div>
  );
}
