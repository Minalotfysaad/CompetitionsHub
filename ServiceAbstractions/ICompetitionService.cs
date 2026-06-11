using CompetitionsTest.DTOs.Competition;
using CompetitionsTest.Models;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface ICompetitionService
    {
        Task<CompetitionDto> CreateAsync(CreateCompetitionDto dto);
        Task<CompetitionDto> GetByIdAsync(int id);
        Task<IEnumerable<CompetitionDto>> GetAllAsync();
        Task<CompetitionDto> UpdateAsync(int id, UpdateCompetitionDto dto);
        Task DeleteAsync(int id);

    }
}
