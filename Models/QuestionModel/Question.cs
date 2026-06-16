using CompetitionsTest.Enums;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration.GridQuestion;
using DomainLayer.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace CompetitionsTest.Models.QuestionModel
{
    public class Question : BaseEntity<int>
    {
        public int DisplayOrder { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }

        public QuestionType Type { get; set; }
        public bool IsRequired { get; set; }
        public int QuestionMark { get; set; }

        // Question Configurations
        public LinearScaleConfiguration? LinearScaleConfiguration { get; set; }
        public GridConfiguration? GridConfiguration { get; set; }
        public ICollection<QuestionOption>? Options { get; set; }
        public QuestionAnswerKey? CorrectAnswer { get; set; }

        // Navigation
        public int CompetitionDayId { get; set; }
        public CompetitionDay CompetitionDay { get; set; } = default!;

        // Not Mapped
        [NotMapped]
        public bool IsAutomaticallyGradable =>
            Type != QuestionType.Paragraph;
    }
}
