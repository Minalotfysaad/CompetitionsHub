using CompetitionsTest.Enums;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration.MultipleChoiceGridQuestion;
using DomainLayer.Models;

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

        //Question Configurations
        public LinearScaleConfiguration? LinearScaleConfiguration { get; set; }
        public MultipleChoiceGridConfiguration? MultipleChoiceGridConfiguration { get; set; }
        public ICollection<QuestionOption>? Options { get; set; } // MultipleChoice 
        public QuestionAnswer? CorrectAnswer { get; set; } // non-option based questions

        //Navigation
        public int CompetitionDayId { get; set; }
        public CompetitionDay CompetitionDay { get; set; }

    }
}
