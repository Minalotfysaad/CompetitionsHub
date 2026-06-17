import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trophy, Plus, Pencil, Trash2, ChevronRight, Search } from 'lucide-react';
import { competitionsApi } from '../../../api/competitions';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { CompetitionListDto } from '../../../types';

export default function CompetitionListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
        <Link to="/admin/competitions/new" className="btn btn-primary">
          <Plus size={16} /> New Competition
        </Link>
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
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Trophy size={28} /></div>
          <h3>{search ? 'No matches found' : 'No competitions yet'}</h3>
          {!search && (
            <Link to="/admin/competitions/new" className="btn btn-primary">
              Create your first competition
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((c: CompetitionListDto, i: number) => (
            <div
              key={c.id}
              className="card card-sm animate-fade-in"
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', animationDelay: `${i * 40}ms` }}
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

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.title}</div>
                {c.description && (
                  <div className="text-sm text-muted truncate">{c.description}</div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <Link
                  to={`/admin/competitions/${c.id}`}
                  className="btn btn-ghost btn-sm btn-icon"
                  title="View"
                >
                  <ChevronRight size={16} />
                </Link>
                <Link
                  to={`/admin/competitions/${c.id}/edit`}
                  className="btn btn-ghost btn-sm btn-icon"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  className="btn btn-danger btn-sm btn-icon"
                  title="Delete"
                  onClick={() => setDeletingId(c.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
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
