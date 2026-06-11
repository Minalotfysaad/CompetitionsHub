using CompetitionsTest.Enums;
using CompetitionsTest.Models.MultipleChoiceGridQuestion;
using DomainLayer.Models;

namespace CompetitionsTest.Models
{
    public class Question : BaseEntity<int>
    {
        public int DisplayOrder { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public QuestionType Type { get; set; }
        public bool IsRequired { get; set; }
        public int Mark { get; set; }

        //Questions Configurations
        public LinearScaleConfiguration? LinearScaleConfiguration { get; set; }
        public MultipleChoiceGridConfiguration? MultipleChoiceGridConfiguration { get; set; }
        public ICollection<QuestionOption>? Options { get; set; } // MultipleChoice, Checkboxes

        //Navigational
        public CompetitionDay CompetitionDay { get; set; }
        public int CompetitionDayId { get; set; }

    }
}
