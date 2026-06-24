namespace CompetitionsTest.DTOs.Results.Contestant_Results
{
    public class UserCompetitionResultDto
    {
        public int CompetitionId { get; set; }
        public string CompetitionTitle { get; set; } = null!;
        public int TotalScore { get; set; }
        public decimal Percentage { get; set; }
        public List<UserCompetitionDayResultDto> Days { get; set; } = [];
    }
}
