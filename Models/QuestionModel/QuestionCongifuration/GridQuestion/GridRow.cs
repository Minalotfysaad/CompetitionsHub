using DomainLayer.Models;

namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration.GridQuestion
{
    public class GridRow : BaseEntity<int>
    {
        public string Text { get; set; } = default!;

        // Navigation
        public int GridConfigurationId { get; set; }
        public GridConfiguration GridConfiguration { get; set; } = default!;
    }
}
