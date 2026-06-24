using CompetitionsTest.Enums;

namespace CompetitionsTest.DTOs.Results.Contestant_Results
{
    public class UserCompetitionDayResultDto
    {
        public int SubmissionId { get; set; }
        public int CompetitionDayId { get; set; }
        public string DayTitle { get; set; } = null!;
        public int DayNum { get; set; }
        public int Score { get; set; }
        public decimal Percentage { get; set; }
        public SubmissionStatus Status { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public List<UserQuestionResponseDto> Responses { get; set; } = [];
    }
}
