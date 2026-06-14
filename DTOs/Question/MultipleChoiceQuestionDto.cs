namespace CompetitionsTest.DTOs.Question
{
    public class MultipleChoiceQuestionDto
    {
        public List<string> Options { get; set; } = [];
        public int CorrectOptionIndex { get; set; }
    }
}
