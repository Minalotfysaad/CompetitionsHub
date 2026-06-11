namespace CompetitionsTest.DTOs.CompetitionDay
{
    public class UpdateCompetitionDayDto
    {
        public string Title { get; set; } = default!;
        public int DayNum { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
