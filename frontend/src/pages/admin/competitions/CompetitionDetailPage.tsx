import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, Clock, Award, Pencil } from 'lucide-react';
import { competitionsApi } from '../../../api/competitions';
import { competitionDaysApi } from '../../../api/competitionDays';
import { format } from 'date-fns';
import { useState } from 'react';
import toast from 'react-hot-toast';
import DraggableQuestionList from '../../../components/questions/DraggableQuestionList';

export default function CompetitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const compId = Number(id);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [deletingDayId, setDeletingDayId] = useState<number | null>(null);

  const { data: competition, isLoading } = useQuery({
    queryKey: ['competition', compId],
    queryFn: () => competitionsApi.getById(compId),
  });

  const deleteDayMutation = useMutation({
    mutationFn: competitionDaysApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', compId] });
      toast.success('Day deleted');
      setDeletingDayId(null);
    },
    onError: () => toast.error('Failed to delete day'),
  });

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <span className="spinner spinner-lg" />
    </div>
  );

  if (!competition) return (
    <div className="empty-state">
      <p>Competition not found.</p>
      <Link to="/admin/competitions" className="btn btn-primary">Back to list</Link>
    </div>
  );

  const days = competition.days ?? [];

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '0.5rem' }} onClick={() => navigate('/admin/competitions')}>
            <ArrowLeft size={16} /> Competitions
          </button>
          <h1 className="page-title">{competition.title}</h1>
          {competition.description && <p className="page-subtitle">{competition.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to={`/admin/competitions/${compId}/edit`} className="btn btn-secondary">
            <Pencil size={15} /> Edit
          </Link>
          <Link to={`/admin/competitions/${compId}/days/new`} className="btn btn-primary">
            <Plus size={15} /> Add Day
          </Link>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="badge badge-primary"><Calendar size={12} /> {days.length} Day{days.length !== 1 ? 's' : ''}</div>
        <div className="badge badge-info">
          <Award size={12} />
          {days.reduce((s, d) => s + (d.dayTotalMark ?? 0), 0)} Total Marks
        </div>
      </div>

      {days.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Calendar size={28} /></div>
          <h3>No days yet</h3>
          <p>Add competition days to get started.</p>
          <Link to={`/admin/competitions/${compId}/days/new`} className="btn btn-primary">
            <Plus size={16} /> Add First Day
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {days.sort((a, b) => a.dayNum - b.dayNum).map((day, i) => {
            const now = new Date();
            const start = new Date(day.startDate);
            const end = new Date(day.endDate);
            const isActive = now >= start && now <= end;
            const isPast = now > end;

            return (
              <div key={day.id} className="card card-sm animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <div className="day-num">{day.dayNum}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{day.title}</span>
                        {isActive && <span className="badge badge-success">Active</span>}
                        {isPast && <span className="badge badge-muted">Past</span>}
                        {!isActive && !isPast && <span className="badge badge-info">Upcoming</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                        <span className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={12} /> {format(start, 'MMM d, yyyy HH:mm')} → {format(end, 'MMM d, yyyy HH:mm')}
                        </span>
                        <span className="badge badge-muted"><Award size={11} /> {day.dayTotalMark} marks</span>
                        <span className="text-sm text-muted">{day.questions?.length ?? 0} question{(day.questions?.length ?? 0) !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link to={`/admin/competitions/${compId}/days/${day.id}/questions/new`} className="btn btn-ghost btn-sm" title="Add Question">
                      <Plus size={15} />
                    </Link>
                    <Link to={`/admin/competitions/${compId}/days/${day.id}/edit`} className="btn btn-ghost btn-sm btn-icon" title="Edit Day">
                      <Pencil size={15} />
                    </Link>
                    <button className="btn btn-danger btn-sm btn-icon" title="Delete Day" onClick={() => setDeletingDayId(day.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Questions list */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.875rem' }}>
                  {day.questions && day.questions.length > 0 ? (
                    <>
                      <div
                        className="text-xs text-subtle"
                        style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}
                      >
                        Questions — drag to reorder
                      </div>
                      <DraggableQuestionList
                        questions={day.questions}
                        competitionId={compId}
                        invalidateKeys={[['competition', compId]]}
                      />
                    </>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
                      No questions added to this day yet.
                    </div>
                  )}

                  <Link
                    to={`/admin/competitions/${compId}/days/${day.id}/questions/new`}
                    className="btn btn-secondary btn-sm"
                    style={{
                      marginTop: '0.75rem',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <Plus size={14} /> Add Question
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Day Modal */}
      {deletingDayId !== null && (
        <div className="modal-backdrop" onClick={() => setDeletingDayId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Day</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setDeletingDayId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Delete this competition day and all its questions? This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeletingDayId(null)}>Cancel</button>
              <button className="btn btn-danger" disabled={deleteDayMutation.isPending} onClick={() => deleteDayMutation.mutate(deletingDayId)}>
                {deleteDayMutation.isPending ? <span className="spinner" /> : <Trash2 size={14} />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
