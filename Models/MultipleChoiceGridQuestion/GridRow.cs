using DomainLayer.Models;

namespace CompetitionsTest.Models.MultipleChoiceGridQuestion
{
    public class GridRow : BaseEntity<int>
    {
        public string Text { get; set; }

        // Navigational Prop
        public MultipleChoiceGridConfiguration GridConfiguration { get; set; }
        public int GridConfigurationId { get; set; }
    }
}
