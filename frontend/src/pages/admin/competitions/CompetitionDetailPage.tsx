import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Calendar, Clock, Award, Pencil, ChevronDown, ChevronUp, Save, X } from 'lucide-react';
import { competitionsApi } from '../../../api/competitions';
import { competitionDaysApi } from '../../../api/competitionDays';
import { format } from 'date-fns';
import { useState } from 'react';
import toast from 'react-hot-toast';
import DraggableQuestionList from '../../../components/questions/DraggableQuestionList';

function toDatetimeLocal(iso: string) {
  return iso ? iso.slice(0, 16) : '';
}

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

  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [editingDayId, setEditingDayId] = useState<number | null>(null);
  const [editDayTitle, setEditDayTitle] = useState('');
  const [editDayNum, setEditDayNum] = useState(1);
  const [editDayStart, setEditDayStart] = useState('');
  const [editDayEnd, setEditDayEnd] = useState('');

  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [newDayNum, setNewDayNum] = useState(1);
  const [newDayStart, setNewDayStart] = useState('');
  const [newDayEnd, setNewDayEnd] = useState('');

  const [isEditingComp, setIsEditingComp] = useState(false);
  const [compTitle, setCompTitle] = useState('');
  const [compDesc, setCompDesc] = useState('');

  const toggleDay = (dayId: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const updateCompMutation = useMutation({
    mutationFn: (vals: { title: string; description?: string }) =>
      competitionsApi.update(compId, vals),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', compId] });
      toast.success('Competition updated!');
      setIsEditingComp(false);
    },
    onError: () => toast.error('Failed to update competition'),
  });

  const createDayMutation = useMutation({
    mutationFn: (vals: { dayNum: number; title: string; startDate: string; endDate: string }) =>
      competitionDaysApi.create({
        competitionId: compId,
        dayNum: vals.dayNum,
        title: vals.title,
        startDate: new Date(vals.startDate).toISOString(),
        endDate: new Date(vals.endDate).toISOString(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', compId] });
      toast.success('Day created!');
      setIsAddingDay(false);
      setNewDayTitle('');
      setNewDayNum(1);
      setNewDayStart('');
      setNewDayEnd('');
    },
    onError: () => toast.error('Failed to create day'),
  });

  const updateDayMutation = useMutation({
    mutationFn: (vals: { id: number; dayNum: number; title: string; startDate: string; endDate: string }) =>
      competitionDaysApi.update(vals.id, {
        dayNum: vals.dayNum,
        title: vals.title,
        startDate: new Date(vals.startDate).toISOString(),
        endDate: new Date(vals.endDate).toISOString(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', compId] });
      toast.success('Day updated!');
      setEditingDayId(null);
    },
    onError: () => toast.error('Failed to update day'),
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
        {isEditingComp ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '600px' }}>
            <button className="btn btn-ghost btn-sm" style={{ marginBottom: '0.5rem', width: 'fit-content' }} onClick={() => navigate('/admin/competitions')}>
              <ArrowLeft size={16} /> Competitions
            </button>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Competition Title *</label>
              <input
                type="text"
                className="form-input"
                value={compTitle}
                onChange={(e) => setCompTitle(e.target.value)}
                placeholder="Competition Title"
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
              <textarea
                className="form-input"
                value={compDesc}
                onChange={(e) => setCompDesc(e.target.value)}
                placeholder="Competition Description"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                className="btn btn-primary btn-sm"
                disabled={updateCompMutation.isPending}
                onClick={() => {
                  if (!compTitle.trim()) {
                    toast.error('Title is required');
                    return;
                  }
                  updateCompMutation.mutate({ title: compTitle, description: compDesc });
                }}
              >
                {updateCompMutation.isPending ? <span className="spinner" /> : <Save size={14} />} Save Changes
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditingComp(false)}
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <button className="btn btn-ghost btn-sm" style={{ marginBottom: '0.5rem' }} onClick={() => navigate('/admin/competitions')}>
                <ArrowLeft size={16} /> Competitions
              </button>
              <h1 className="page-title">{competition.title}</h1>
              {competition.description && <p className="page-subtitle">{competition.description}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditingComp(true);
                  setCompTitle(competition.title);
                  setCompDesc(competition.description || '');
                }}
              >
                <Pencil size={15} /> Edit Competition
              </button>
              <button
                onClick={() => {
                  setIsAddingDay(true);
                  setNewDayTitle('');
                  setNewDayNum(days.length + 1);
                  setNewDayStart('');
                  setNewDayEnd('');
                }}
                className="btn btn-primary"
              >
                <Plus size={15} /> Add Day
              </button>
            </div>
          </>
        )}
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="badge badge-primary"><Calendar size={12} /> {days.length} Day{days.length !== 1 ? 's' : ''}</div>
        <div className="badge badge-info">
          <Award size={12} />
          {days.reduce((s, d) => s + (d.dayTotalMark ?? 0), 0)} Total Marks
        </div>
      </div>

      {(days.length === 0 && !isAddingDay) ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Calendar size={28} /></div>
          <h3>No days yet</h3>
          <p>Add competition days to get started.</p>
          <button
            onClick={() => {
              setIsAddingDay(true);
              setNewDayTitle('');
              setNewDayNum(1);
              setNewDayStart('');
              setNewDayEnd('');
            }}
            className="btn btn-primary"
          >
            <Plus size={16} /> Add First Day
          </button>
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
              <div
                key={day.id}
                className="card card-sm animate-fade-in"
                style={{
                  animationDelay: `${i * 40}ms`,
                  cursor: editingDayId === day.id ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => {
                  if (editingDayId !== day.id) {
                    toggleDay(day.id);
                  }
                }}
              >
                {editingDayId === day.id ? (
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>
                      Edit Day Settings
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Day Title *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Day 1 – Old Testament"
                          value={editDayTitle}
                          onChange={(e) => setEditDayTitle(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Day # *</label>
                        <input
                          type="number"
                          min={1}
                          className="form-input"
                          value={editDayNum}
                          onChange={(e) => setEditDayNum(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Start Date & Time *</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={editDayStart}
                          onChange={(e) => setEditDayStart(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>End Date & Time *</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={editDayEnd}
                          onChange={(e) => setEditDayEnd(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingDayId(null)}
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={updateDayMutation.isPending}
                        onClick={() => {
                          if (!editDayTitle.trim()) {
                            toast.error('Title is required');
                            return;
                          }
                          if (editDayNum < 1) {
                            toast.error('Day number must be at least 1');
                            return;
                          }
                          if (!editDayStart || !editDayEnd) {
                            toast.error('Dates are required');
                            return;
                          }
                          if (editDayEnd <= editDayStart) {
                            toast.error('End date must be after start date');
                            return;
                          }
                          updateDayMutation.mutate({
                            id: day.id,
                            title: editDayTitle,
                            dayNum: editDayNum,
                            startDate: editDayStart,
                            endDate: editDayEnd,
                          });
                        }}
                      >
                        {updateDayMutation.isPending ? <span className="spinner" /> : <Save size={14} />} Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDay(day.id);
                          }}
                          title={expandedDays[day.id] ? "Collapse" : "Expand"}
                          style={{ flexShrink: 0 }}
                        >
                          {expandedDays[day.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
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

                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Edit Day"
                          onClick={() => {
                            setEditingDayId(day.id);
                            setEditDayTitle(day.title);
                            setEditDayNum(day.dayNum);
                            setEditDayStart(toDatetimeLocal(day.startDate));
                            setEditDayEnd(toDatetimeLocal(day.endDate));
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" title="Delete Day" onClick={() => setDeletingDayId(day.id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Questions list with animation */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        maxHeight: expandedDays[day.id] ? '2000px' : '0px',
                        opacity: expandedDays[day.id] ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out, margin 0.3s ease, padding 0.3s ease',
                        marginTop: expandedDays[day.id] ? '1rem' : '0px',
                        borderTop: expandedDays[day.id] ? '1px solid var(--border)' : '0px solid transparent',
                        paddingTop: expandedDays[day.id] ? '0.875rem' : '0px',
                      }}
                    >
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
                  </>
                )}
              </div>
            );
          })}

          {isAddingDay && (
            <div
              className="card card-sm animate-fade-in"
              style={{
                borderColor: 'var(--primary)',
                borderWidth: 1,
                borderStyle: 'solid',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.25rem',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                Add New Competition Day
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Day Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Day 1 – Old Testament"
                    value={newDayTitle}
                    onChange={(e) => setNewDayTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Day # *</label>
                  <input
                    type="number"
                    min={1}
                    className="form-input"
                    value={newDayNum}
                    onChange={(e) => setNewDayNum(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={newDayStart}
                    onChange={(e) => setNewDayStart(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>End Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={newDayEnd}
                    onChange={(e) => setNewDayEnd(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsAddingDay(false)}
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={createDayMutation.isPending}
                  onClick={() => {
                    if (!newDayTitle.trim()) {
                      toast.error('Title is required');
                      return;
                    }
                    if (newDayNum < 1) {
                      toast.error('Day number must be at least 1');
                      return;
                    }
                    if (!newDayStart || !newDayEnd) {
                      toast.error('Dates are required');
                      return;
                    }
                    if (newDayEnd <= newDayStart) {
                      toast.error('End date must be after start date');
                      return;
                    }
                    createDayMutation.mutate({
                      title: newDayTitle,
                      dayNum: newDayNum,
                      startDate: newDayStart,
                      endDate: newDayEnd,
                    });
                  }}
                >
                  {createDayMutation.isPending ? <span className="spinner" /> : <Plus size={14} />} Create Day
                </button>
              </div>
            </div>
          )}
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
