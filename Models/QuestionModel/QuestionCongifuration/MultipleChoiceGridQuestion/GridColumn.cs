using DomainLayer.Models;

namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration.MultipleChoiceGridQuestion
{
    public class GridColumn : BaseEntity<int>
    {
        public string Text { get; set; }

        // Navigation
        public int GridConfigurationId { get; set; }
        public MultipleChoiceGridConfiguration GridConfiguration { get; set; } = default!;
    }
}
