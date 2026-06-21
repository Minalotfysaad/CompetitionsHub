namespace CompetitionsTest.DTOs.Leaderboard
{
    public class CompetitionLeaderboardDto
    {
        public int CompetitionId { get; set; }
        public string CompetitionTitle { get; set; } = null!;
        public List<CompetitionRankingDto> Rankings { get; set; } = [];
    }
}
