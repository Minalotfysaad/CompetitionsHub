using DomainLayer.Models;


namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration.MultipleChoiceGridQuestion
{
    public class GridAnswerKey : BaseEntity<int>
    {
        public string RowKey { get; set; } = default!;
        public string ColumnKey { get; set; } = default!;

        //Navigation
        public int GridConfigurationId { get; set; }
        public MultipleChoiceGridConfiguration GridConfiguration { get; set; } = default!;
    }
}
