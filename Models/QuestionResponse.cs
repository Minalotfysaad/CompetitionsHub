using CompetitionsTest.Models.QuestionModel;
using DomainLayer.Models;

namespace CompetitionsTest.Models
{
    public class QuestionResponse : BaseEntity<int>
    {
        public int CompetitionSubmissionId { get; set; }
        public CompetitionSubmission CompetitionSubmission { get; set; } = null!;

        public int QuestionId { get; set; }
        public Question Question { get; set; } = null!;

        public string? AnswerData { get; set; }
        public bool? IsCorrect { get; set; }
        public int EarnedMark { get; set; }
        public bool IsManuallyGraded { get; set; }
        public string? ReviewerComment { get; set; }
    }
}
