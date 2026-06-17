import api from './client';
import type { CreateQuestionDto, QuestionDto } from '../types';

export const questionsApi = {
  getById: (id: number) =>
    api.get<QuestionDto>(`/api/Question/${id}`).then((r) => r.data),

  create: (dto: CreateQuestionDto) =>
    api.post<QuestionDto>('/api/Question', dto).then((r) => r.data),

  update: (id: number, dto: CreateQuestionDto) =>
    api.put<QuestionDto>(`/api/Question/${id}`, dto).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/api/Question/${id}`).then((r) => r.data),
};
