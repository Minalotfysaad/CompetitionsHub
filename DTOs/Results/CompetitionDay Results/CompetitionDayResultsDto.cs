namespace CompetitionsTest.DTOs.Results.CompetitionDay_Results
{
    public class CompetitionDayResultsDto
    {
        public int CompetitionDayId { get; set; }
        public string DayTitle { get; set; } = null!;
        public int DayNum { get; set; }
        public int CompetitionId { get; set; }
        public string CompetitionTitle { get; set; } = null!;
        public int TotalMark { get; set; }
        public List<CompetitionDaySubmissionDto> Submissions { get; set; } = [];
    }
}
