import { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { GripVertical, Pencil, Award } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '../../api/questions';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { QuestionDto } from '../../types';
import { QuestionType } from '../../types';

const TYPE_LABELS: Record<number, string> = {
  [QuestionType.ShortAnswer]:    'Short Answer',
  [QuestionType.Paragraph]:      'Paragraph',
  [QuestionType.MultipleChoice]: 'Multiple Choice',
  [QuestionType.Grid]:           'Grid',
  [QuestionType.LinearScale]:    'Linear Scale',
};

const TYPE_COLORS: Record<number, string> = {
  [QuestionType.ShortAnswer]:    'badge-info',
  [QuestionType.Paragraph]:      'badge-muted',
  [QuestionType.MultipleChoice]: 'badge-primary',
  [QuestionType.Grid]:           'badge-success',
  [QuestionType.LinearScale]:    'badge-warning',
};

interface Props {
  questions: QuestionDto[];
  competitionId: number;
  /** Query keys to invalidate after a successful reorder */
  invalidateKeys: unknown[][];
  /** Question currently being edited (highlighted) */
  activeQuestionId?: number;
  /** Compact styling for the side panel */
  compact?: boolean;
}

export default function DraggableQuestionList({
  questions: initialQuestions,
  competitionId,
  invalidateKeys,
  activeQuestionId,
  compact = false,
}: Props) {
  const qc = useQueryClient();

  // Local copy for optimistic reordering
  const [items, setItems] = useState<QuestionDto[]>(
    () => [...initialQuestions].sort((a, b) => a.displayOrder - b.displayOrder)
  );

  // Keep in sync when parent data updates (e.g. after refetch)
  useEffect(() => {
    setItems([...initialQuestions].sort((a, b) => a.displayOrder - b.displayOrder));
  }, [initialQuestions]);

  const reorderMutation = useMutation({
    mutationFn: questionsApi.reorder,
    onSuccess: () => {
      invalidateKeys.forEach((key) => qc.invalidateQueries({ queryKey: key }));
    },
    onError: () => {
      toast.error('Failed to save new order');
      setItems([...initialQuestions].sort((a, b) => a.displayOrder - b.displayOrder)); // rollback
    },
  });

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || result.destination.index === result.source.index) return;

      const reordered = Array.from(items);
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);

      // Assign sequential display orders starting at 1
      const updated = reordered.map((q, i) => ({ ...q, displayOrder: i + 1 }));
      setItems(updated);

      reorderMutation.mutate(
        updated.map((q) => ({ id: q.id, displayOrder: q.displayOrder }))
      );
    },
    [items, reorderMutation]
  );

  if (items.length === 0) return null;

  const rowPad   = compact ? '0.4rem 0.5rem' : '0.5rem 0.75rem';
  const fontSize = compact ? '0.78rem'       : '0.875rem';

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
          >
            {items.map((q, index) => {
              const isActive = activeQuestionId === q.id;
              return (
                <Draggable key={q.id} draggableId={String(q.id)} index={index}>
                  {(drag, snapshot) => (
                    <div
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: rowPad,
                        background: snapshot.isDragging
                          ? 'var(--surface-3)'
                          : isActive
                          ? 'var(--primary-light)'
                          : 'var(--surface-2)',
                        borderRadius: 'var(--radius-sm)',
                        border: isActive
                          ? '1px solid var(--primary)'
                          : snapshot.isDragging
                          ? '1px solid var(--border-hover)'
                          : '1px solid transparent',
                        boxShadow: snapshot.isDragging ? 'var(--shadow)' : 'none',
                        transition: snapshot.isDragging ? 'none' : 'all 0.15s ease',
                        cursor: snapshot.isDragging ? 'grabbing' : 'default',
                        ...drag.draggableProps.style,
                      }}
                    >
                      {/* Drag handle */}
                      <div
                        {...drag.dragHandleProps}
                        style={{
                          color: 'var(--text-subtle)',
                          cursor: 'grab',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 2px',
                        }}
                        title="Drag to reorder"
                      >
                        <GripVertical size={compact ? 13 : 15} />
                      </div>

                      {/* Order badge */}
                      <span
                        style={{
                          fontSize: compact ? '0.65rem' : '0.7rem',
                          fontWeight: 700,
                          color: isActive ? 'var(--primary)' : 'var(--text-subtle)',
                          minWidth: compact ? 16 : 20,
                          flexShrink: 0,
                        }}
                      >
                        #{q.displayOrder}
                      </span>

                      {/* Title + badges */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize,
                            fontWeight: 500,
                            color: isActive ? 'var(--primary)' : 'var(--text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={q.title}
                        >
                          {q.title}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.3rem',
                            marginTop: '0.15rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            className={`badge ${TYPE_COLORS[q.type] ?? 'badge-muted'}`}
                            style={{ fontSize: compact ? '0.6rem' : '0.7rem', padding: '0.15rem 0.4rem' }}
                          >
                            {TYPE_LABELS[q.type] ?? 'Unknown'}
                          </span>
                          <span
                            className="badge badge-muted"
                            style={{ fontSize: compact ? '0.6rem' : '0.7rem', padding: '0.15rem 0.4rem' }}
                          >
                            <Award size={compact ? 9 : 10} /> {q.questionMark}
                          </span>
                        </div>
                      </div>

                      {/* Edit link */}
                      <Link
                        to={`/admin/competitions/${competitionId}/questions/${q.id}/edit`}
                        className="btn btn-ghost btn-icon"
                        style={{ padding: compact ? '0.2rem' : '0.3rem', flexShrink: 0 }}
                        title="Edit"
                      >
                        <Pencil size={compact ? 12 : 14} />
                      </Link>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
