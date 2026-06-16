using CompetitionsTest.DTOs.Question.Contestant;

namespace CompetitionsTest.DTOs.CompetitionDay
{
    public class CompetitionDayContestantDto
    {
        public int Id { get; set; }
        public int CompetitionId { get; set; }
        public int DayNum { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int DayTotalMark { get; set; }
        public bool IsActive =>
            DateTime.UtcNow >= StartDate &&
            DateTime.UtcNow <= EndDate;
        public IEnumerable<QuestionContestantDto> Questions { get; set; } = [];
    }
}
