using CompetitionsTest.Enums;

namespace CompetitionsTest.DTOs.Question.Contestant
{
    public class QuestionContestantDto
    {
        public int Id { get; set; }
        public int CompetitionDayId { get; set; }
        public int DisplayOrder { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public QuestionType Type { get; set; }
        public bool IsRequired { get; set; }
        public int QuestionMark { get; set; }
        public IEnumerable<QuestionOptionDto>? Options { get; set; }
        public LinearScaleContestantDto? LinearScale { get; set; }
        public GridContestantDto? Grid { get; set; }
    }
}
