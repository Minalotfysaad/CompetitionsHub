using CompetitionsTest.DTOs.CompetitionDay;
using CompetitionsTest.Models;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface ICompetitionDayService
    {
        Task<CompetitionDayDto> CreateAsync(CreateCompetitionDayDto dto);
        Task<CompetitionDayDto> UpdateAsync(int id, UpdateCompetitionDayDto dto);
        Task DeleteAsync(int id);
        Task<CompetitionDayDto> GetByIdAsync(int id);
        Task<IEnumerable<CompetitionDayDto>> GetByCompetitionIdAsync(int competitionId);
        Task<CompetitionDayDto?> GetActiveDayAsync(int competitionId, DateTime now);
    }
}
