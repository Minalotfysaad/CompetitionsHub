using DomainLayer.Models;

namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration.MultipleChoiceGridQuestion
{
    public class GridRow : BaseEntity<int>
    {
        public string Text { get; set; } = default!;

        // Navigation
        public int GridConfigurationId { get; set; }
        public MultipleChoiceGridConfiguration GridConfiguration { get; set; } = default!;
    }
}
