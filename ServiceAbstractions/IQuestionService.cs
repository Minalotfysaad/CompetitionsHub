using CompetitionsTest.DTOs.Question;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface IQuestionService
    {
        Task<QuestionDto> CreateAsync(CreateQuestionDto dto);
        Task<QuestionDto> GetByIdAsync(int id);
        Task<IEnumerable<QuestionDto>> GetByCompetitionDayAsync(int competitionDayId);
        Task<QuestionDto> UpdateAsync(int id, CreateQuestionDto dto);
        Task DeleteAsync(int id);
    }
}
