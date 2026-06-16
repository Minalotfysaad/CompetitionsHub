namespace CompetitionsTest.DTOs.Question
{
    public class GridDto
    {
        public List<string> Rows { get; set; } = [];
        public List<string> Columns { get; set; } = [];
        public List<GridAnswerKeyDto> AnswerKeys { get; set; } = [];
    }
}
