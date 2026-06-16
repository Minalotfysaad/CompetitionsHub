namespace CompetitionsTest.DTOs.Question
{
    public class MultipleChoiceDto
    {
        public List<string> Options { get; set; } = [];
        public int CorrectOptionIndex { get; set; }
    }
}
