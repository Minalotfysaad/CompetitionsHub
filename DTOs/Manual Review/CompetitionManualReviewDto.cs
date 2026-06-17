namespace CompetitionsTest.DTOs.Manual_Review
{
    public class CompetitionManualReviewDto
    {
        public int CompetitionId { get; set; }
        public string CompetitionName { get; set; } = null!;
        public int PendingResponsesCount { get; set; }
    }
}
