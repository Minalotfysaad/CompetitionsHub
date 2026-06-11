namespace CompetitionsTest.DTOs.Competition
{
    public class CreateCompetitionDto
    {
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
    }
}
