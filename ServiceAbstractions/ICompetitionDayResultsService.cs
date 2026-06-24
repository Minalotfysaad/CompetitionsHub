using CompetitionsTest.DTOs.Results.CompetitionDay_Results;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface ICompetitionDayResultsService
    {
        Task<CompetitionDayResultsDto> GetCompetitionDayResultsAsync(int competitionDayId);
    }
}
