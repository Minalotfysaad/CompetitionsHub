using DomainLayer.Models;

namespace CompetitionsTest.Models
{
    public class LinearScaleConfiguration : BaseEntity<int>
    {
        public int MinValue { get; set; }
        public int MaxValue { get; set; }
        public string? MinLabel { get; set; }
        public string? MaxLabel { get; set; }

        //Navigational Properties
        public Question Question { get; set; }
        public int QuestionId { get; set; }
    }
}
