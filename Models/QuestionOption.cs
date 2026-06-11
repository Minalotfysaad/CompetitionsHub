using DomainLayer.Models;

namespace CompetitionsTest.Models
{
    public class QuestionOption : BaseEntity<int>
    {
        public string Text { get; set; }

        //Navigational Prop
        public Question Question { get; set; }
        public int QuestionId { get; set; }
    }
}
