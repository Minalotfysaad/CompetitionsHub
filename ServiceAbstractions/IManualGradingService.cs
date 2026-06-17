using CompetitionsTest.DTOs.Manual_Review;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface IManualGradingService
    {
        Task<IEnumerable<CompetitionManualReviewDto>> GetCompetitionsWithPendingReviewsAsync();
        Task<IEnumerable<CompetitionDayManualReviewDto>> GetCompetitionDaysWithPendingReviewsAsync(int competitionId);
        Task<IEnumerable<ParagraphQuestionReviewDto>> GetParagraphQuestionsAsync(int competitionDayId);
        Task<QuestionReviewDetailsDto> GetQuestionReviewDetailsAsync(int questionId);
        Task GradeResponseAsync(int responseId, GradeResponseDto dto);
    }
}
