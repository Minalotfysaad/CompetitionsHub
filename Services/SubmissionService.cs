using AutoMapper;
using CompetitionsTest.DTOs.Submission;
using CompetitionsTest.Enums;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using GarasForms.Core;
using ServiceAbstraction;

namespace CompetitionsTest.Services
{
    public class SubmissionService(IUnitOfWork _unitOfWork, IMapper _mapper, IGradingService _gradingService) : ISubmissionService
    {
        public async Task<SubmissionDto> StartSubmissionAsync(StartSubmissionDto dto)
        {
            var dayRepo = _unitOfWork.GetRepository<CompetitionDay, int>();
            var day = await dayRepo.GetByIdAsync(dto.CompetitionDayId);
            if (day == null)
                throw new Exception("Competition day not found");

            if (day.StartDate > DateTime.UtcNow)
                throw new Exception("This competition day has not started yet.");

            var submissionRepo = _unitOfWork.GetRepository<CompetitionSubmission, int>();

            //Check if already submission exists
            var existing = await submissionRepo.FindAsync(
                s => s.UserId == dto.UserId && s.CompetitionDayId == dto.CompetitionDayId,
                includes: new[] { "Responses" });

            if (existing is not null)
                return _mapper.Map<SubmissionDto>(existing);

            // If not, create submission:
            var submission = new CompetitionSubmission
            {
                UserId = dto.UserId,
                CompetitionDayId = dto.CompetitionDayId,
                StartedAt = DateTime.UtcNow,
                Status = SubmissionStatus.InProgress
            };

            await submissionRepo.AddAsync(submission);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<SubmissionDto>(submission);
        }

        public async Task<QuestionResponseDto> AutoSaveAnswerAsync(SaveAnswerDto dto)
        {
            var repo =_unitOfWork.GetRepository<QuestionResponse, int>();
            var response =await repo.FindAsync(r =>r.CompetitionSubmissionId == dto.SubmissionId && r.QuestionId == dto.QuestionId);

            if (response is null)
            {
                response = new QuestionResponse
                {
                    CompetitionSubmissionId = dto.SubmissionId,
                    QuestionId = dto.QuestionId,
                    AnswerData = dto.AnswerData
                };
                await repo.AddAsync(response);
            }
            else
            {
                response.AnswerData = dto.AnswerData;
                repo.Update(response);
            }


            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<QuestionResponseDto>(response);
        }

        public async Task<SubmissionDto> GetSubmissionByIdAsync(int id) // If session crashed, it retrieves submission autosaved answers
        {
            var submissionRepo =_unitOfWork.GetRepository<CompetitionSubmission, int>();

            var submission = await submissionRepo.FindAsync(s => s.Id == id,includes:["Responses"]);

            if (submission is null)
                throw new Exception("Submission not found");

            return _mapper.Map<SubmissionDto>(submission);
        }

        public async Task<SubmissionDto> SubmitAsync(int id)
        {
            var submissionRepo = _unitOfWork.GetRepository<CompetitionSubmission, int>();
            var submission = await submissionRepo.FindAsync(
                s => s.Id == id,
                includes:
                [
                    "Responses",
                    "CompetitionDay",
                    "CompetitionDay.Questions"
                ]);

            if (submission is null)
                throw new Exception("Submission not found");

            if (submission.Status != SubmissionStatus.InProgress)
                throw new Exception("Submission already completed");

            var requiredQuestions = submission.CompetitionDay.Questions.Where(q => q.IsRequired);
            var answeredQuestions =submission.Responses.Select(r => r.QuestionId);
            bool missing = requiredQuestions.Any(q => !answeredQuestions.Contains(q.Id));

            if (missing)
                throw new Exception("Please answer all required questions");

            submission.Status = SubmissionStatus.Submitted;
            submission.SubmittedAt = DateTime.UtcNow;

            submissionRepo.Update(submission);
            await _unitOfWork.SaveChangesAsync();

            await _gradingService.GradeSubmissionAsync(submission.Id); //Grading

            return _mapper.Map<SubmissionDto>(submission);
        }


    }
}
