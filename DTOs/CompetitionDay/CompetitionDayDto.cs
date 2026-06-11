using CompetitionsTest.DTOs.Question;

namespace CompetitionsTest.DTOs.CompetitionDay
{
    public class CompetitionDayDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int DayNum { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int CompetitionId { get; set; }
        public int DayTotalMark { get; set; }
        public IEnumerable<QuestionDto> Questions { get; set; } = [];
    }
}
