using CompetitionsTest.Enums;

namespace CompetitionsTest.DTOs.QuestionDto
{
    public class QuestionDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public QuestionType Type { get; set; }
        public bool IsRequired { get; set; }
        public int Mark { get; set; }
        public int CompetitionDayId { get; set; }

        // MultipleChoice, Checkboxes, Dropdown
        public List<string>? Options { get; set; }
        // LinearScale
        public LinearScaleDto? LinearScale { get; set; }
        // MultipleChoiceGrid, CheckboxGrid
        public GridDto? Grid { get; set; }
    }
}
