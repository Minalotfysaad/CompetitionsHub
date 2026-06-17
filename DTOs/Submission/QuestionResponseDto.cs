namespace CompetitionsTest.DTOs.Submission
{
    public class QuestionResponseDto
    {
        public int QuestionId { get; set; }
        public string? AnswerData { get; set; }
        public bool? IsCorrect { get; set; }
        public int EarnedMark { get; set; }
    }
}
