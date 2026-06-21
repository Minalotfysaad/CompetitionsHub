namespace CompetitionsTest.DTOs.Leaderboard
{
    public class CompetitionRankingDto
    {
        public int Rank { get; set; }
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public int TotalScore { get; set; }
        public decimal Percentage { get; set; }
    }
}
