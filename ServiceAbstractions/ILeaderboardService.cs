using CompetitionsTest.DTOs.Leaderboard;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface ILeaderboardService
    {
        Task<CompetitionDayLeaderboardDto>GetCompetitionDayLeaderboardAsync(int competitionDayId);

        Task<CompetitionLeaderboardDto>GetCompetitionLeaderboardAsync(int competitionId);
    }
}
