namespace CompetitionsTest.DTOs.Manual_Review
{
    public class QuestionReviewResponseDto
    {
        public int ResponseId { get; set; }
        public int SubmissionId { get; set; }
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string AnswerData { get; set; } = null!;
        public DateTime SubmittedAt { get; set; }
        public bool IsManuallyGraded { get; set; }
        public int EarnedMark { get; set; }
    }
}
