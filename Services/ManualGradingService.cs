using Azure;
using CompetitionsTest.DTOs.Manual_Review;
using CompetitionsTest.Enums;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using DomainLayer.Contracts;
using GarasForms.Core;

namespace CompetitionsTest.Services;

    public class ManualGradingService(IUnitOfWork _unitOfWork) : IManualGradingService
    {

        public async Task<IEnumerable<CompetitionManualReviewDto>>GetCompetitionsWithPendingReviewsAsync()
        {
            var repo = _unitOfWork.GetRepository<QuestionResponse, int>();
            var responses = await repo.FindAllAsync(r => r.Question.Type == QuestionType.Paragraph && !r.IsManuallyGraded,
                includes:
                [
                    "Question",
                    "CompetitionSubmission",
                    "CompetitionSubmission.CompetitionDay",
                    "CompetitionSubmission.CompetitionDay.Competition"
                ]);
            if (responses is null)
                throw new Exception("There is no responses to be reviewed in this competition");

            return responses.GroupBy(r => new
                {
                 r.CompetitionSubmission.CompetitionDay.Competition.Id,
                 r.CompetitionSubmission.CompetitionDay.Competition.Title
                })
                .Select(g => new CompetitionManualReviewDto
                {
                    CompetitionId = g.Key.Id,
                    CompetitionName = g.Key.Title,
                    PendingResponsesCount = g.Count()
                });
        }

        public async Task<IEnumerable<CompetitionDayManualReviewDto>> GetCompetitionDaysWithPendingReviewsAsync(int competitionId)
        {
            var repo =_unitOfWork.GetRepository<QuestionResponse, int>();
            var responses = await repo.FindAllAsync(
                r =>r.Question.Type == QuestionType.Paragraph &&!r.IsManuallyGraded &&
                    r.CompetitionSubmission.CompetitionDay.CompetitionId == competitionId,
                includes:
                [
                    "Question",
                    "CompetitionSubmission",
                    "CompetitionSubmission.CompetitionDay"
                ]);

            if (responses is null)
                throw new Exception("There is no responses to be reviewed in this day");

        return responses.GroupBy(r => new
                {
                    r.CompetitionSubmission.CompetitionDay.Id,
                    r.CompetitionSubmission.CompetitionDay.DayNum
                })
                .Select(g => new CompetitionDayManualReviewDto
                {
                    CompetitionDayId = g.Key.Id,
                    DayNum = g.Key.DayNum,
                    PendingResponsesCount = g.Count()
                });
        }

        public async Task<IEnumerable<ParagraphQuestionReviewDto>> GetParagraphQuestionsAsync(int competitionDayId)
        {
            var repo = _unitOfWork.GetRepository<QuestionResponse, int>();
            var responses = await repo.FindAllAsync(r =>
                    r.Question.Type == QuestionType.Paragraph &&
                   !r.IsManuallyGraded &&
                    r.Question.CompetitionDayId == competitionDayId,
                includes:["Question"]);

            if (responses is null)
                throw new Exception("There is no responses to be reviewed for this question");

        return responses.GroupBy(r => new
                {
                    r.Question.Id,
                    r.Question.Title,
                    r.Question.QuestionMark
                }).Select(g => new ParagraphQuestionReviewDto
                {
                    QuestionId = g.Key.Id,
                    Title = g.Key.Title,
                    QuestionMark = g.Key.QuestionMark,
                    PendingSubmissionsCount = g.Count()
                });
        }

        public async Task<QuestionReviewDetailsDto>GetQuestionReviewDetailsAsync(int questionId)
        {
            var repo = _unitOfWork.GetRepository<QuestionResponse, int>();
            var responses = await repo.FindAllAsync(r =>
                    r.QuestionId == questionId &&
                    r.Question.Type == QuestionType.Paragraph,
                    includes:
                    [
                        "Question",
                        "Question.CompetitionDay",
                        "Question.CompetitionDay.Competition",
                        "CompetitionSubmission",
                        "CompetitionSubmission.User"
                    ]);


            var first = responses.FirstOrDefault();

            if (first is null)
                throw new Exception("Paragraph question not found");


            return new QuestionReviewDetailsDto
            {
                QuestionId = first.QuestionId,
                CompetitionName = first.Question .CompetitionDay.Competition.Title,
                DayNum = first.Question.CompetitionDay.DayNum,
                QuestionTitle = first.Question.Title,
                QuestionMark = first.Question.QuestionMark,
                Responses =responses.Select(r => new QuestionReviewResponseDto
                    {
                        ResponseId = r.Id,
                        SubmissionId = r.CompetitionSubmissionId,
                        UserId = r.CompetitionSubmission.UserId,
                        UserName =r.CompetitionSubmission.User.UserName ?? string.Empty,
                        Email = r.CompetitionSubmission.User.Email?? string.Empty,
                        AnswerData = r.AnswerData ?? string.Empty,
                        SubmittedAt = r.CompetitionSubmission.SubmittedAt ?? DateTime.MinValue,
                        IsManuallyGraded = r.IsManuallyGraded,
                        EarnedMark = r.EarnedMark
                    }).ToList()
            };
        }

        public async Task GradeResponseAsync( int responseId, GradeResponseDto dto)
        {
            var repo = _unitOfWork.GetRepository<QuestionResponse, int>();
            var response = await repo.FindAsync( r => r.Id == responseId,
                    includes:
                    [
                        "Question",
                        "CompetitionSubmission",
                        "CompetitionSubmission.Responses",
                        "CompetitionSubmission.Responses.Question",
                        "CompetitionSubmission.CompetitionDay",
                        "CompetitionSubmission.CompetitionDay.Questions"
                    ]);


            if (response is null)
                throw new Exception("Response not found");

            if (response.Question.Type != QuestionType.Paragraph)
                throw new Exception("Only paragraph questions require manual grading");

            if (dto.EarnedMark < 0 || dto.EarnedMark > response.Question.QuestionMark)
                throw new Exception($"Mark must be between 0 and {response.Question.QuestionMark}");


            response.EarnedMark = dto.EarnedMark;
            response.IsCorrect = dto.EarnedMark == response.Question.QuestionMark;
            response.IsManuallyGraded = true;
            response.ReviewerComment = dto.ReviewerComment;

            RecalculateSubmission(response.CompetitionSubmission);
            repo.Update(response);


            await _unitOfWork.SaveChangesAsync();
        }


        #region Helpers
        private static void RecalculateSubmission(CompetitionSubmission submission)
        {
            submission.TotalScore =submission.Responses.Sum(r => r.EarnedMark);
            int totalDayMark =submission.CompetitionDay.Questions.Sum(q => q.QuestionMark);
            submission.Percentage =totalDayMark == 0 ? 0 : ((decimal)submission.TotalScore /totalDayMark) * 100;
            bool hasPendingManualReview =submission.Responses.Any(r =>r.Question.Type == QuestionType.Paragraph && !r.IsManuallyGraded);
            submission.Status = hasPendingManualReview? SubmissionStatus.PendingManualReview: SubmissionStatus.Graded;
        }


        #endregion
}