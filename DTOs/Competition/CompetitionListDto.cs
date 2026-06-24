namespace CompetitionsTest.DTOs.Competition
{
    public class CompetitionListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public int DaysCount { get; set; }
    }
}
