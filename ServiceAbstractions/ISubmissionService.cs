using CompetitionsTest.DTOs.Submission;

namespace CompetitionsTest.ServiceAbstractions
{
    public interface ISubmissionService
    {
        Task<SubmissionDto> StartSubmissionAsync(StartSubmissionDto dto);
        Task<QuestionResponseDto> AutoSaveAnswerAsync(SaveAnswerDto dto);
        Task<SubmissionDto> GetSubmissionByIdAsync(int id);
        Task<SubmissionDto> SubmitAsync(int id);
    }
}
