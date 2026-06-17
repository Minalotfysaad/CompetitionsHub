namespace CompetitionsTest.DTOs.Submission
{
    public class SaveAnswerDto
    {
        public int SubmissionId { get; set; }
        public int QuestionId { get; set; }
        public string? AnswerData { get; set; }
    }
}
