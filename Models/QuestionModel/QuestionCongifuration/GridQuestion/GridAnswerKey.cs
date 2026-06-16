using DomainLayer.Models;


namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration.GridQuestion
{
    public class GridAnswerKey : BaseEntity<int>
    {
        public string RowKey { get; set; } = default!;
        public string ColumnKey { get; set; } = default!;

        //Navigation
        public int GridConfigurationId { get; set; }
        public GridConfiguration GridConfiguration { get; set; } = default!;
    }
}
