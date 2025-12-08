import { useDroppable } from '@dnd-kit/core';
import { type Lead } from '../../services/api';
import { LeadCard } from './LeadCard';

interface KanbanColumnProps {
  id: Lead['status'];
  title: string;
  color: string;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export function KanbanColumn({ id, title, color, leads, onLeadClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`${color} rounded-lg p-3 mb-3`}>
        <h3 className="text-gray-900">{title}</h3>
        <p className="text-gray-600">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        </p>
      </div>

      <div
        ref={setNodeRef}
        className={`
          min-h-[500px] space-y-3 p-2 rounded-lg transition-colors
          ${isOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-50'}
        `}
      >
        {leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => onLeadClick(lead)}
          />
        ))}

        {leads.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400">
            Arraste leads para cá
          </div>
        )}
      </div>
    </div>
  );
}
