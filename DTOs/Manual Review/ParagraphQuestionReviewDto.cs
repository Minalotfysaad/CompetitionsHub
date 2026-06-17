namespace CompetitionsTest.DTOs.Manual_Review
{
    public class ParagraphQuestionReviewDto
    {
        public int QuestionId { get; set; }
        public string Title { get; set; } = null!;
        public int QuestionMark { get; set; }
        public int PendingSubmissionsCount { get; set; }
        public int GradedSubmissionsCount { get; set; }
    }
}
