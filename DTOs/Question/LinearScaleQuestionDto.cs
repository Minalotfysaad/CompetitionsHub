namespace CompetitionsTest.DTOs.Question
{
    public class LinearScaleQuestionDto
    {
        public int MinValue { get; set; }
        public int MaxValue { get; set; }
        public string? MinLabel { get; set; }
        public string? MaxLabel { get; set; }
        public int CorrectValue { get; set; }
    }
}
