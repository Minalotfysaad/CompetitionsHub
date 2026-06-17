namespace CompetitionsTest.DTOs.Submission
{
    public class StartSubmissionDto
    {
        public int CompetitionDayId { get; set; }
        public string UserId { get; set; } = null!; // TEMPORARILY UNTIL INTEGRATION WITH SYSTEM (Later will come from JWT)
    }
}
