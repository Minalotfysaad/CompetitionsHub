import api from './client';
import type { CompetitionLeaderboardDto, CompetitionDayLeaderboardDto } from '../types';

export const leaderboardApi = {
  getByCompetition: (competitionId: number) =>
    api
      .get<CompetitionLeaderboardDto>(`/api/Leaderboard/competition/${competitionId}`)
      .then((r) => r.data),

  getByDay: (competitionDayId: number) =>
    api
      .get<CompetitionDayLeaderboardDto>(`/api/Leaderboard/day/${competitionDayId}`)
      .then((r) => r.data),
};
