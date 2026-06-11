using DomainLayer.Models;

namespace CompetitionsTest.Models
{
    public class Competition : BaseEntity<int>
    {
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public ICollection<CompetitionDay> Days { get; set; } = [];
    }
}
