using DomainLayer.Models;


namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration.MultipleChoiceGridQuestion
{
    public class GridCorrectAnswer : BaseEntity<int>
    {
        public int GridConfigurationId { get; set; }
        public MultipleChoiceGridConfiguration GridConfiguration { get; set; } = default!;

        public int GridRowId { get; set; }
        public GridRow GridRow { get; set; } = default!;

        public int GridColumnId { get; set; }
        public GridColumn GridColumn { get; set; } = default!;
    }
}
