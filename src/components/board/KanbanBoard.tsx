'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { Lead, LeadStatus, LEAD_STATUSES } from '@/types/lead';
import { canTransitionTo } from '@/lib/statusMachine';
import { useUpdateLead } from '@/hooks/useUpdateLead';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { toast } from 'sonner';

interface KanbanBoardProps {
  leads: Lead[];
}

export function KanbanBoard({ leads }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const { mutate: updateLead } = useUpdateLead();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      NEW: [],
      CONTACTED: [],
      QUALIFIED: [],
      CONVERTED: [],
      LOST: [],
    };
    leads.forEach((lead) => {
      grouped[lead.status].push(lead);
    });
    return grouped;
  }, [leads]);

  const activeLead = useMemo(
    () => leads.find((l) => l.id === activeId),
    [leads, activeId]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over?.id as string | null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setOverId(null);

      if (!over) return;

      const leadId = active.id as string;
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return;

      const targetStatus = over.id as LeadStatus;
      if (targetStatus === lead.status) return;

      // Validate transition
      if (!canTransitionTo(lead.status, targetStatus)) {
        toast.error(`Can't move directly from ${lead.status} to ${targetStatus}`, {
          description: 'This status transition is not allowed.',
        });
        return;
      }

      // Valid transition — optimistic update
      updateLead({ id: leadId, data: { status: targetStatus } });
    },
    [leads, updateLead]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
  }, []);

  // Determine if a column is a valid drop target based on the active lead
  const getDropValidity = useCallback(
    (columnStatus: LeadStatus): 'valid' | 'invalid' | 'neutral' => {
      if (!activeLead) return 'neutral';
      if (columnStatus === activeLead.status) return 'neutral';
      if (canTransitionTo(activeLead.status, columnStatus)) return 'valid';
      return 'invalid';
    },
    [activeLead]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-2 overflow-hidden pb-4 px-1 h-full w-full">
        {LEAD_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            leads={columns[status]}
            dropValidity={getDropValidity(status)}
            isOver={overId === status}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead && (
          <div className="rotate-3 opacity-90">
            <KanbanCard lead={activeLead} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
