import api from './client';
import type { SaveAnswerDto, StartSubmissionDto, SubmissionDto } from '../types';

export const submissionsApi = {
  start: (dto: StartSubmissionDto) =>
    api.post<SubmissionDto>('/api/Submission/start', dto).then((r) => r.data),

  getById: (id: number) =>
    api.get<SubmissionDto>(`/api/Submission/${id}`).then((r) => r.data),

  saveAnswer: (dto: SaveAnswerDto) =>
    api.post<void>('/api/Submission/answer', dto).then((r) => r.data),

  submit: (id: number) =>
    api.post<SubmissionDto>(`/api/Submission/${id}/submit`).then((r) => r.data),
};
