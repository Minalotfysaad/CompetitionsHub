using DomainLayer.Models;

namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration
{
    public class QuestionOption : BaseEntity<int>
    {
        public string Text { get; set; } = default!;

        //Navigation
        public int QuestionId { get; set; }
        public Question Question { get; set; }
    }
}
