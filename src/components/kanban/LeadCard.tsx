import { useDraggable } from '@dnd-kit/core';
import { Building2, Mail, Phone, Calendar } from 'lucide-react';
import { type Lead } from '../../services/api';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        bg-white rounded-lg p-4 border border-gray-200 shadow-sm
        hover:shadow-md transition-shadow cursor-pointer
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <h4 className="text-gray-900 mb-3">{lead.nome}</h4>

      <div className="space-y-2">
        {lead.empresa && (
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 size={16} />
            <span>{lead.empresa}</span>
          </div>
        )}

        {lead.email && (
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={16} />
            <span className="truncate">{lead.email}</span>
          </div>
        )}

        {lead.telefone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={16} />
            <span>{lead.telefone}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-500 pt-2 border-t border-gray-100">
          <Calendar size={14} />
          <span>
            {new Date(lead.dataCriacao).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      {lead.origem && (
        <div className="mt-3">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {lead.origem}
          </span>
        </div>
      )}
    </div>
  );
}
