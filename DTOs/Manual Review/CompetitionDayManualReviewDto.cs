namespace CompetitionsTest.DTOs.Manual_Review
{
    public class CompetitionDayManualReviewDto
    {
        public int Id { get; set; }
        public int DayNum { get; set; }
        public string Title { get; set; } = string.Empty;
        public int PendingResponsesCount { get; set; }
    }
}
