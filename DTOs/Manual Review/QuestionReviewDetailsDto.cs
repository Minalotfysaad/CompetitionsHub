namespace CompetitionsTest.DTOs.Manual_Review
{
    public class QuestionReviewDetailsDto
    {
        public int QuestionId { get; set; }
        public string CompetitionName { get; set; } = null!;
        public int DayNum { get; set; }
        public string QuestionTitle { get; set; } = null!;
        public int QuestionMark { get; set; }
        public List<QuestionReviewResponseDto> Responses { get; set; } = [];
    }
}
