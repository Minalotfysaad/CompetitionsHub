using CompetitionsTest.Enums;
using CompetitionsTest.Models.Identity;
using DomainLayer.Models;

namespace CompetitionsTest.Models
{
    public class CompetitionSubmission : BaseEntity<int>
    {
        public int CompetitionDayId { get; set; }
        public CompetitionDay CompetitionDay { get; set; } = null!;

        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        public DateTime StartedAt { get; set; }

        public DateTime? SubmittedAt { get; set; }

        public SubmissionStatus Status { get; set; }

        public int TotalScore { get; set; }

        public decimal Percentage { get; set; }

        public ICollection<QuestionResponse> Responses { get; set; }= [];
    }
}
