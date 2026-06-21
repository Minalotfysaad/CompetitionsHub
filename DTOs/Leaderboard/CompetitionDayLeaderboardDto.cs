namespace CompetitionsTest.DTOs.Leaderboard
{
    public class CompetitionDayLeaderboardDto
    {
        public int CompetitionDayId { get; set; }
        public int DayNum { get; set; }
        public List<CompetitionDayRankingDto> Rankings { get; set; } = [];
    }
}
