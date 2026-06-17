import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { questionsApi } from '../../../api/questions';
import QuestionBuilder from '../../../components/questions/QuestionBuilder';
import type { CreateQuestionDto } from '../../../types';
import toast from 'react-hot-toast';

export default function QuestionBuilderPage() {
  const { competitionId, dayId, questionId } = useParams<{
    competitionId: string;
    dayId: string;
    questionId: string;
  }>();
  const isEdit = !!questionId;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: existingQuestion } = useQuery({
    queryKey: ['question', Number(questionId)],
    queryFn: () => questionsApi.getById(Number(questionId)),
    enabled: isEdit,
  });

  const dayIdNum = isEdit ? (existingQuestion?.competitionDayId ?? 0) : Number(dayId);

  const createMutation = useMutation({
    mutationFn: (dto: CreateQuestionDto) => questionsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', Number(competitionId)] });
      toast.success('Question created!');
      navigate(`/admin/competitions/${competitionId}`);
    },
    onError: () => toast.error('Failed to create question'),
  });

  const updateMutation = useMutation({
    mutationFn: (dto: CreateQuestionDto) => questionsApi.update(Number(questionId), dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competition', Number(competitionId)] });
      qc.invalidateQueries({ queryKey: ['question', Number(questionId)] });
      toast.success('Question updated!');
      navigate(`/admin/competitions/${competitionId}`);
    },
    onError: () => toast.error('Failed to update question'),
  });

  function handleSubmit(dto: CreateQuestionDto) {
    isEdit ? updateMutation.mutate(dto) : createMutation.mutate(dto);
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: '0.5rem' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">{isEdit ? 'Edit Question' : 'Add Question'}</h1>
          <p className="page-subtitle">{isEdit ? 'Modify this question' : 'Create a new question for this day'}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <QuestionBuilder
          defaultValues={existingQuestion}
          competitionDayId={dayIdNum}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
