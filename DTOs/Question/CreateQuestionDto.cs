using CompetitionsTest.Enums;

namespace CompetitionsTest.DTOs.Question
{
    public class CreateQuestionDto
    {
        public class CreateQuestionDto
        {
            public int DisplayOrder { get; set; }
            public string Title { get; set; } = default!;
            public string? Description { get; set; }
            public QuestionType Type { get; set; }
            public bool IsRequired { get; set; }
            public int QuestionMark { get; set; }
            public int CompetitionDayId { get; set; }

            // Type-specific sections
            public MultipleChoiceQuestionDto? MultipleChoice { get; set; }
            public LinearScaleQuestionDto? LinearScale { get; set; }
            //public GridQuestionDto? Grid { get; set; }
            public TextQuestionDto? Text { get; set; }
        }
    }
}
