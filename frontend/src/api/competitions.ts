import api from './client';
import type {
  CompetitionDetailsDto,
  CompetitionListDto,
  CreateCompetitionDto,
  UpdateCompetitionDto,
  PaginationResponse,
} from '../types';

export const competitionsApi = {
  getAll: () =>
    api.get<PaginationResponse<CompetitionListDto>>('/api/Competition').then((r) => r.data),

  getById: (id: number) =>
    api.get<CompetitionDetailsDto>(`/api/Competition/${id}`).then((r) => r.data),

  create: (dto: CreateCompetitionDto) =>
    api.post<CompetitionDetailsDto>('/api/Competition', dto).then((r) => r.data),

  update: (id: number, dto: UpdateCompetitionDto) =>
    api.put<CompetitionDetailsDto>(`/api/Competition/${id}`, dto).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/api/Competition/${id}`).then((r) => r.data),
};
