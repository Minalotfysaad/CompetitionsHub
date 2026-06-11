using CompetitionsTest.DTOs.CompetitionDay;

namespace CompetitionsTest.DTOs.Competition
{
    public class CompetitionDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public ICollection<CompetitionDayDto> Days { get; set; } = [];
    }
}
