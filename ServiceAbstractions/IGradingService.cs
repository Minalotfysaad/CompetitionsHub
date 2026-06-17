namespace CompetitionsTest.ServiceAbstractions
{
    public interface IGradingService
    {
        Task GradeSubmissionAsync(int submissionId);
    }
}
