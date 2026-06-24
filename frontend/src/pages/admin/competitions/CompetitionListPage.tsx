import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Plus, Pencil, Trash2, Search, Save, X, Calendar } from 'lucide-react';
import { competitionsApi } from '../../../api/competitions';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { CompetitionListDto } from '../../../types';

export default function CompetitionListPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['competitions'],
    queryFn: competitionsApi.getAll,
  });
  const competitions = data?.items ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => competitionsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      toast.success('Competition deleted');
      setDeletingId(null);
    },
    onError: () => toast.error('Failed to delete competition'),
  });

  const updateCompetitionMutation = useMutation({
    mutationFn: ({ id, title, description }: { id: number; title: string; description: string }) =>
      competitionsApi.update(id, { title, description }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      toast.success('Competition updated');
      setEditingId(null);
    },
    onError: () => toast.error('Failed to update competition'),
  });

  const createCompetitionMutation = useMutation({
    mutationFn: (dto: { title: string; description?: string }) => competitionsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      toast.success('Competition created!');
      setIsAdding(false);
      setNewTitle('');
      setNewDesc('');
    },
    onError: () => toast.error('Failed to create competition'),
  });

  const filtered = competitions.filter((c: CompetitionListDto) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Competitions</h1>
          <p className="page-subtitle">{competitions.length} competition{competitions.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setNewTitle('');
            setNewDesc('');
          }}
          className="btn btn-primary"
        >
          <Plus size={16} /> New Competition
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: 360 }}>
        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
        <input
          type="text"
          placeholder="Search competitions…"
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <span className="spinner spinner-lg" />
        </div>
      ) : (filtered.length === 0 && !isAdding) ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Trophy size={28} /></div>
          <h3>{search ? 'No matches found' : 'No competitions yet'}</h3>
          {!search && (
            <button
              onClick={() => {
                setIsAdding(true);
                setNewTitle('');
                setNewDesc('');
              }}
              className="btn btn-primary"
            >
              Create your first competition
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((c: CompetitionListDto, i: number) => (
            <div
              key={c.id}
              className="card card-sm animate-fade-in"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                animationDelay: `${i * 40}ms`,
                cursor: editingId === c.id ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                if (editingId !== c.id) {
                  navigate(`/admin/competitions/${c.id}`);
                }
              }}
            >
              {editingId === c.id ? (
                <>
                  <div style={{
                    width: 44, height: 44,
                    background: 'var(--primary-light)',
                    borderRadius: 'var(--radius)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Trophy size={20} style={{ color: 'var(--primary)' }} />
                  </div>

                  <div
                    style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Competition Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ width: '100%' }}
                    />
                    <input
                      type="text"
                      className="form-input text-sm"
                      placeholder="Competition Description (optional)"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-primary btn-sm btn-icon"
                      title="Save"
                      onClick={() => {
                        if (!editTitle.trim()) {
                          toast.error('Title is required');
                          return;
                        }
                        updateCompetitionMutation.mutate({ id: c.id, title: editTitle, description: editDesc });
                      }}
                      disabled={updateCompetitionMutation.isPending}
                    >
                      {updateCompetitionMutation.isPending ? <span className="spinner" /> : <Save size={16} />}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm btn-icon"
                      title="Cancel"
                      onClick={() => setEditingId(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: 44, height: 44,
                    background: 'var(--primary-light)',
                    borderRadius: 'var(--radius)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Trophy size={20} style={{ color: 'var(--primary)' }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.title}</div>
                    {c.description && (
                      <div className="text-sm text-muted truncate">{c.description}</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <span className="badge badge-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                        <Calendar size={11} /> {c.daysCount ?? 0} Day{(c.daysCount ?? 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      title="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setEditingId(c.id);
                        setEditTitle(c.title);
                        setEditDesc(c.description || '');
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDeletingId(c.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {isAdding && (
            <div
              className="card card-sm animate-fade-in"
              style={{
                borderColor: 'var(--primary)',
                borderWidth: 1,
                borderStyle: 'solid',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{
                width: 44, height: 44,
                background: 'var(--primary-light)',
                borderRadius: 'var(--radius)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Trophy size={20} style={{ color: 'var(--primary)' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.85rem' }}>Create New Competition</div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Competition Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
                <input
                  type="text"
                  className="form-input text-sm"
                  placeholder="Competition Description (optional)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  className="btn btn-primary btn-sm btn-icon"
                  title="Create"
                  onClick={() => {
                    if (!newTitle.trim()) {
                      toast.error('Title is required');
                      return;
                    }
                    createCompetitionMutation.mutate({ title: newTitle, description: newDesc });
                  }}
                  disabled={createCompetitionMutation.isPending}
                >
                  {createCompetitionMutation.isPending ? <span className="spinner" /> : <Save size={16} />}
                </button>
                <button
                  className="btn btn-secondary btn-sm btn-icon"
                  title="Cancel"
                  onClick={() => setIsAdding(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingId !== null && (
        <div className="modal-backdrop" onClick={() => setDeletingId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Competition</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setDeletingId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this competition? This action cannot be undone and will also remove all associated days and questions.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeletingId(null)}>Cancel</button>
              <button
                className="btn btn-danger"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deletingId)}
              >
                {deleteMutation.isPending ? <span className="spinner" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
