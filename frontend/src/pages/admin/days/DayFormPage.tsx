import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { competitionDaysApi } from '../../../api/competitionDays';
import toast from 'react-hot-toast';

interface FormValues {
  title: string;
  dayNum: number;
  startDate: string;
  endDate: string;
}

function toDatetimeLocal(iso: string) {
  return iso ? iso.slice(0, 16) : '';
}

export default function DayFormPage() {
  const { competitionId, dayId } = useParams<{ competitionId: string; dayId: string }>();
  const isEdit = !!dayId;
  const compId = Number(competitionId);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing } = useQuery({
    queryKey: ['day', Number(dayId)],
    queryFn: () => competitionDaysApi.getById(Number(dayId)),
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<FormValues>();
  const startDate = watch('startDate');

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        dayNum: existing.dayNum,
        startDate: toDatetimeLocal(existing.startDate),
        endDate: toDatetimeLocal(existing.endDate),
      });
    }
  }, [existing, reset]);

  const createMutation = useMutation({
    mutationFn: (vals: FormValues) =>
      competitionDaysApi.create({
        competitionId: compId,
        dayNum: Number(vals.dayNum),
        title: vals.title,
        startDate: new Date(vals.startDate).toISOString(),
        endDate: new Date(vals.endDate).toISOString(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', compId] });
      toast.success('Day created!');
      navigate(`/admin/competitions/${compId}`);
    },
    onError: () => toast.error('Failed to create day'),
  });

  const updateMutation = useMutation({
    mutationFn: (vals: FormValues) =>
      competitionDaysApi.update(Number(dayId), {
        dayNum: Number(vals.dayNum),
        title: vals.title,
        startDate: new Date(vals.startDate).toISOString(),
        endDate: new Date(vals.endDate).toISOString(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', compId] });
      qc.invalidateQueries({ queryKey: ['day', Number(dayId)] });
      toast.success('Day updated!');
      navigate(`/admin/competitions/${compId}`);
    },
    onError: () => toast.error('Failed to update day'),
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
          <h1 className="page-title">{isEdit ? 'Edit Day' : 'Add Competition Day'}</h1>
          <p className="page-subtitle">{isEdit ? 'Update day settings' : 'Add a new day to this competition'}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="day-title">Day Title <span className="required">*</span></label>
              <input
                id="day-title"
                type="text"
                placeholder="e.g. Day 1 – Old Testament"
                className={`form-input${errors.title ? ' error' : ''}`}
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="day-num">Day # <span className="required">*</span></label>
              <input
                id="day-num"
                type="number"
                min={1}
                className={`form-input${errors.dayNum ? ' error' : ''}`}
                {...register('dayNum', { required: 'Required', min: { value: 1, message: 'Min 1' }, valueAsNumber: true })}
              />
              {errors.dayNum && <span className="form-error">{errors.dayNum.message}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="start-date">Start Date & Time <span className="required">*</span></label>
              <input
                id="start-date"
                type="datetime-local"
                className={`form-input${errors.startDate ? ' error' : ''}`}
                {...register('startDate', { required: 'Start date is required' })}
              />
              {errors.startDate && <span className="form-error">{errors.startDate.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="end-date">End Date & Time <span className="required">*</span></label>
              <input
                id="end-date"
                type="datetime-local"
                className={`form-input${errors.endDate ? ' error' : ''}`}
                {...register('endDate', {
                  required: 'End date is required',
                  validate: (v) => !startDate || v > startDate || 'Must be after start date',
                })}
              />
              {errors.endDate && <span className="form-error">{errors.endDate.message}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? <span className="spinner" /> : <Save size={16} />}
              {isEdit ? 'Save Changes' : 'Create Day'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
