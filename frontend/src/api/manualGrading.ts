import api from './client';
import type {
  CompetitionDayManualReviewDto,
  CompetitionManualReviewDto,
  GradeResponseDto,
  ParagraphQuestionReviewDto,
  QuestionReviewDetailsDto,
} from '../types';

export const manualGradingApi = {
  getCompetitions: () =>
    api
      .get<CompetitionManualReviewDto[]>('/api/ManualGrading/competitions')
      .then((r) => r.data),

  getDays: (competitionId: number) =>
    api
      .get<CompetitionDayManualReviewDto[]>(
        `/api/ManualGrading/competitions/${competitionId}/days`
      )
      .then((r) => r.data),

  getQuestions: (competitionDayId: number) =>
    api
      .get<ParagraphQuestionReviewDto[]>(
        `/api/ManualGrading/days/${competitionDayId}/questions`
      )
      .then((r) => r.data),

  getGradedQuestions: (competitionDayId: number) =>
    api
      .get<ParagraphQuestionReviewDto[]>(
        `/api/ManualGrading/days/${competitionDayId}/graded-questions`
      )
      .then((r) => r.data),

  getQuestionDetails: (questionId: number) =>
    api
      .get<QuestionReviewDetailsDto>(`/api/ManualGrading/questions/${questionId}`)
      .then((r) => r.data),

  gradeResponse: (responseId: number, dto: GradeResponseDto) =>
    api
      .post<void>(`/api/ManualGrading/responses/${responseId}`, dto)
      .then((r) => r.data),
};
