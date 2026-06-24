using CompetitionsTest.DTOs;
using CompetitionsTest.DTOs.Competition;
using CompetitionsTest.Helpers;
using CompetitionsTest.Models;
using GarasForms.Core.Helpers;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface ICompetitionService
    {
        Task<CompetitionDto> CreateAsync(CreateCompetitionDto dto);
        //Task<IEnumerable<CompetitionListDto>> GetAllAsync();
        Task<PaginationResponse<CompetitionListDto>> GetAllAsync(CompetitionQueryParams queryParams);
        Task<PaginationResponse<CompetitionListDto>> GetActiveCompetitionsAsync(CompetitionQueryParams queryParams);
        Task<CompetitionDetailsDto> GetByIdAsync(int id);
        Task<CompetitionDto> UpdateAsync(int id, UpdateCompetitionDto dto);
        Task DeleteAsync(int id);

    }
}
