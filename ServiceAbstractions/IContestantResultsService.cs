using CompetitionsTest.DTOs.Results.Contestant_Results;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface IContestantResultsService
    {
       Task<UserResultsDto> GetUserResultsAsync(string userId);
    }
}
