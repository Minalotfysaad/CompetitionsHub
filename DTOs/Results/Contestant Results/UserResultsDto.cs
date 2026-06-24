namespace CompetitionsTest.DTOs.Results.Contestant_Results
{
    public class UserResultsDto
    {
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public List<UserCompetitionResultDto> Competitions { get; set; } = [];
    }
}

