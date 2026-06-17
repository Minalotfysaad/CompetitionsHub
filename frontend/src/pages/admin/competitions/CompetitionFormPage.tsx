import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { competitionsApi } from '../../../api/competitions';
import toast from 'react-hot-toast';

interface FormValues { title: string; description: string; }

export default function CompetitionFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ['competition', Number(id)],
    queryFn: () => competitionsApi.getById(Number(id)),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (existing) reset({ title: existing.title, description: existing.description ?? '' });
  }, [existing, reset]);

  const createMutation = useMutation({
    mutationFn: competitionsApi.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      toast.success('Competition created!');
      navigate(`/admin/competitions/${data.id}`);
    },
    onError: () => toast.error('Failed to create competition'),
  });

  const updateMutation = useMutation({
    mutationFn: (vals: FormValues) => competitionsApi.update(Number(id), vals),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competitions'] });
      qc.invalidateQueries({ queryKey: ['competition', Number(id)] });
      toast.success('Competition updated!');
      navigate(`/admin/competitions/${id}`);
    },
    onError: () => toast.error('Failed to update competition'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(vals: FormValues) {
    isEdit ? updateMutation.mutate(vals) : createMutation.mutate(vals);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '0.5rem' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">{isEdit ? 'Edit Competition' : 'New Competition'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update competition details' : 'Create a new competition'}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Bible Knowledge Competition 2025"
              className={`form-input${errors.title ? ' error' : ''}`}
              {...register('title', { required: 'Title is required', minLength: { value: 2, message: 'Min 2 characters' } })}
            />
            {errors.title && <span className="form-error">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Optional description of this competition…"
              className="form-textarea"
              style={{ minHeight: 120 }}
              {...register('description')}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? <span className="spinner" /> : <Save size={16} />}
              {isEdit ? 'Save Changes' : 'Create Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
