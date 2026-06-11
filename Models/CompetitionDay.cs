using DomainLayer.Models;
using CompetitionsTest.Models.QuestionModel;

namespace CompetitionsTest.Models
{
    public class CompetitionDay : BaseEntity<int>
    {
        public string Title { get; set; } = default!;
        public int DayNum { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ICollection<Question> Questions { get; set; } = [];

        //Navigational Property
        public int CompetitionId { get; set; }
        public Competition Competition { get; set; }

        // Computed
        public int DayTotalMark => Questions?.Sum(q => q.QuestionMark) ?? 0;
    }
}
