using DomainLayer.Models;

namespace CompetitionsTest.Models.QuestionModel.QuestionCongifuration
{
    public class QuestionCorrectAnswer : BaseEntity<int>
    {
        public string AnswerData { get; set; } = default!;

        //Navigation
        public int QuestionId { get; set; }
        public Question Question { get; set; } = default!;
    }
}
