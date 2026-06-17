using CompetitionsTest.Enums;

namespace CompetitionsTest.DTOs.Submission
{
    public class SubmissionDto
    {
        public int Id { get; set; }
        public int CompetitionDayId { get; set; }
        public SubmissionStatus Status { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public int TotalScore { get; set; }
        public decimal Percentage { get; set; }
        public List<QuestionResponseDto> Responses { get; set; } = [];
    }
}
