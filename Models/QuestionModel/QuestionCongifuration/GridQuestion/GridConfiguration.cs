using CompetitionsTest.Enums;
using DomainLayer.Models;

namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration.GridQuestion
{
    public class GridConfiguration : BaseEntity<int>
    {
        public ICollection<GridRow> Rows { get; set; } = [];
        public ICollection<GridColumn> Columns { get; set; } = [];
        public ICollection<GridAnswerKey> AnswerKeys { get; set; } = [];

        //Navigational Properties
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        
    }
}
