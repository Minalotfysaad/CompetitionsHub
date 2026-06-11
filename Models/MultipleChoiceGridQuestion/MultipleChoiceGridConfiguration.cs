using CompetitionsTest.Enums;
using DomainLayer.Models;

namespace CompetitionsTest.Models.MultipleChoiceGridQuestion
{
    public class MultipleChoiceGridConfiguration : BaseEntity<int>
    {
        public GridSelectionMode SelectionMode { get; set; }
        public ICollection<GridRow> Rows { get; set; } = [];
        public ICollection<GridColumn> Columns { get; set; } = [];

        //Navigational Properties
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        
    }
}
