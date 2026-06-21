namespace CompetitionsTest.DTOs.Leaderboard
{
    public class CompetitionDayRankingDto
    {
        public int Rank { get; set; }
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public int Score { get; set; }
        public decimal Percentage { get; set; }
    }
}
