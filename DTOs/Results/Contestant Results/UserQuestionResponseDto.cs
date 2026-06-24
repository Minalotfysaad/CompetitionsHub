using CompetitionsTest.Enums;

namespace CompetitionsTest.DTOs.Results.Contestant_Results
{
    public class UserQuestionResponseDto
    {
        public int QuestionId { get; set; }
        public string QuestionTitle { get; set; } = null!;
        public QuestionType QuestionType { get; set; }
        public int QuestionMark { get; set; }
        public string? AnswerData { get; set; }
        public int EarnedMark { get; set; }
        public bool? IsCorrect { get; set; }
        public bool IsManuallyGraded { get; set; }
        public string? ReviewerComment { get; set; }
        public string? ModelAnswer { get; set; }
    }
}
