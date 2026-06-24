using CompetitionsTest.Enums;

namespace CompetitionsTest.DTOs.Results.CompetitionDay_Results
{
    public class CompetitionDayQuestionResponseDto
    {
        public int ResponseId { get; set; }
        public int QuestionId { get; set; }
        public string QuestionTitle { get; set; } = null!;
        public QuestionType QuestionType { get; set; }
        public int QuestionMark { get; set; }
        public string? AnswerData { get; set; }
        public string? ModelAnswer { get; set; }
        public int EarnedMark { get; set; }
        public bool? IsCorrect { get; set; }
        public bool IsManuallyGraded { get; set; }
        public string? ReviewerComment { get; set; }
    }
}
