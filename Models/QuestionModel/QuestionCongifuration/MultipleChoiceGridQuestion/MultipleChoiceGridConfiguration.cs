using CompetitionsTest.Enums;
using DomainLayer.Models;

namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration.MultipleChoiceGridQuestion
{
    public class MultipleChoiceGridConfiguration : BaseEntity<int>
    {
        public ICollection<GridRow> Rows { get; set; } = [];
        public ICollection<GridColumn> Columns { get; set; } = [];
        public ICollection<GridCorrectAnswer> CorrectAnswers { get; set; } = [];

        //Navigational Properties
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        
    }
}
