import api from './client';
import type {
  CompetitionDayDto,
  CompetitionDayContestantDto,
  CreateCompetitionDayDto,
  UpdateCompetitionDayDto,
} from '../types';

export const competitionDaysApi = {
  // Admin endpoints
  getById: (id: number) =>
    api.get<CompetitionDayDto>(`/api/CompetitionDayAdmin/${id}`).then((r) => r.data),

  getByCompetition: (competitionId: number) =>
    api
      .get<CompetitionDayDto[]>(`/api/CompetitionDayAdmin/competition/${competitionId}`)
      .then((r) => r.data),

  getActive: (competitionId: number) =>
    api
      .get<CompetitionDayDto[]>(`/api/CompetitionDayAdmin/competition/${competitionId}/active`)
      .then((r) => r.data),

  create: (dto: CreateCompetitionDayDto) =>
    api.post<CompetitionDayDto>('/api/CompetitionDayAdmin', dto).then((r) => r.data),

  update: (id: number, dto: UpdateCompetitionDayDto) =>
    api.put<CompetitionDayDto>(`/api/CompetitionDayAdmin/${id}`, dto).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/api/CompetitionDayAdmin/${id}`).then((r) => r.data),

  // Contestant endpoints
  contestantGetById: (id: number) =>
    api
      .get<CompetitionDayContestantDto>(`/api/CompetitionDayContestant/${id}`)
      .then((r) => r.data),

  contestantGetByCompetition: (competitionId: number) =>
    api
      .get<CompetitionDayContestantDto[]>(
        `/api/CompetitionDayContestant/competition/${competitionId}`
      )
      .then((r) => r.data),

  contestantGetActive: (competitionId: number) =>
    api
      .get<CompetitionDayContestantDto[]>(
        `/api/CompetitionDayContestant/competition/${competitionId}/active`
      )
      .then((r) => r.data),
};
