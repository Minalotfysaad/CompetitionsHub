using CompetitionsTest.Enums;

namespace CompetitionsTest.DTOs.Results.CompetitionDay_Results
{
    public class CompetitionDaySubmissionDto
    {
        public int SubmissionId { get; set; }
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public SubmissionStatus Status { get; set; }
        public int TotalScore { get; set; }
        public decimal Percentage { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public List<CompetitionDayQuestionResponseDto> Responses { get; set; } = [];
    }
}
