using CompetitionsTest.DTOs.Results.CompetitionDay_Results;
using CompetitionsTest.Enums;
using CompetitionsTest.Models;
using CompetitionsTest.Models.QuestionModel;
using CompetitionsTest.ServiceAbstractions;
using GarasForms.Core;

namespace CompetitionsTest.Services
{
    public class CompetitionDayResultsService(IUnitOfWork unitOfWork) : ICompetitionDayResultsService
    {
        public async Task<CompetitionDayResultsDto>GetCompetitionDayResultsAsync(int competitionDayId)
        {
            var submissionRepo =unitOfWork.GetRepository<CompetitionSubmission, int>();

            var submissions =await submissionRepo.FindAllAsync( s => s.CompetitionDayId == competitionDayId,
                    includes:
                    [
                        "User",

                    "CompetitionDay",
                    "CompetitionDay.Competition",
                    "CompetitionDay.Questions",

                    "Responses",
                    "Responses.Question",

                    "Responses.Question.Options",
                    "Responses.Question.CorrectAnswer",

                    "Responses.Question.GridConfiguration",
                    "Responses.Question.GridConfiguration.AnswerKeys"
                    ]);

            var firstSubmission = submissions.FirstOrDefault();

            if (firstSubmission is null)
                throw new Exception("No submissions found");

            var day = firstSubmission.CompetitionDay;

            return new CompetitionDayResultsDto
            {
                CompetitionDayId = day.Id,
                DayTitle = day.Title,
                DayNum = day.DayNum,
                CompetitionId = day.CompetitionId,
                CompetitionTitle = day.Competition.Title,
                TotalMark = day.Questions.Sum(q => q.QuestionMark),
                Submissions = submissions
                    .OrderByDescending(s => s.TotalScore)
                    .Select(s =>
                        new CompetitionDaySubmissionDto
                        {
                            SubmissionId = s.Id,
                            UserId = s.UserId,
                            UserName = s.User.UserName ?? string.Empty,
                            Email = s.User.Email ?? string.Empty,
                            Status = s.Status,
                            TotalScore = s.TotalScore,
                            Percentage = s.Percentage,
                            StartedAt = s.StartedAt,
                            SubmittedAt = s.SubmittedAt,
                            Responses = s.Responses.OrderBy(r => r.Question.DisplayOrder)
                                .Select(r =>
                                    new CompetitionDayQuestionResponseDto
                                    {
                                        ResponseId = r.Id,
                                        QuestionId = r.QuestionId,
                                        QuestionTitle = r.Question.Title,
                                        QuestionType = r.Question.Type,
                                        QuestionMark = r.Question.QuestionMark,
                                        AnswerData = r.AnswerData,
                                        ModelAnswer =BuildModelAnswer(r.Question),
                                        EarnedMark =r.EarnedMark,
                                        IsCorrect = r.IsCorrect,
                                        IsManuallyGraded = r.IsManuallyGraded,
                                        ReviewerComment = r.ReviewerComment
                                    }).ToList()
                        }).ToList()
            };
        }

        #region Helpers

        private static string? BuildModelAnswer(Question question)
        {
            return question.Type switch
            {
                QuestionType.MultipleChoice => BuildMultipleChoiceAnswer(question),
                QuestionType.ShortAnswer =>question.CorrectAnswer?.AnswerData,
                QuestionType.LinearScale => question.CorrectAnswer?.AnswerData,
                QuestionType.Grid => BuildGridAnswer(question),
                QuestionType.Paragraph => null,
                _ => null
            };
        }

        private static string? BuildMultipleChoiceAnswer( Question question)
        {
            if (question.CorrectAnswer is null || question.Options is null)
                return null;

            if (!int.TryParse(question.CorrectAnswer.AnswerData, out int index))
                return null;

            return question.Options.OrderBy(o => o.Id).ElementAtOrDefault(index)?.Text;
        }

        private static string BuildGridAnswer(Question question)
        {
            if (question.GridConfiguration is null)
                return string.Empty;

            return string.Join( "; ", question.GridConfiguration.AnswerKeys.Select(a =>$"{a.RowKey} -> {a.ColumnKey}"));
        }

        #endregion
    }
}
