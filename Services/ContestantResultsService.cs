    using CompetitionsTest.DTOs.Results.Contestant_Results;
    using CompetitionsTest.Enums;
    using CompetitionsTest.Models;
    using CompetitionsTest.Models.QuestionModel;
    using CompetitionsTest.ServiceAbstractions;
    using GarasForms.Core;

    namespace CompetitionsTest.Services
    {
        public class ContestantResultsService(IUnitOfWork _unitOfWork): IContestantResultsService
        {
            public async Task<UserResultsDto>GetUserResultsAsync(string userId)
            {
                var submissionRepo =_unitOfWork.GetRepository<CompetitionSubmission, int>();
                var submissions = await submissionRepo.FindAllAsync(s => s.UserId == userId,
                        includes:
                        [
                        "User",

                        "CompetitionDay",
                        "CompetitionDay.Competition",
                        "CompetitionDay.Competition.Days",
                        "CompetitionDay.Competition.Days.Questions",

                        "Responses",
                        "Responses.Question",

                        "Responses.Question.Options",
                        "Responses.Question.CorrectAnswer",

                        "Responses.Question.GridConfiguration",
                        "Responses.Question.GridConfiguration.AnswerKeys"
                        ]);

                var firstSubmission =submissions.FirstOrDefault();

                if (firstSubmission is null)
                    throw new Exception("No results found for this user");

                var competitions = submissions
                        .GroupBy(s => new
                        {
                            s.CompetitionDay.Competition.Id,
                            s.CompetitionDay.Competition.Title
                        })
                        .Select(g =>
                        {
                            var competition =g.First().CompetitionDay.Competition;

                            int competitionTotalMark =competition.Days.Sum(d => d.Questions.Sum(q => q.QuestionMark));

                            int totalScore = g.Sum(x => x.TotalScore);

                            return new UserCompetitionResultDto
                            {
                                CompetitionId = g.Key.Id,
                                CompetitionTitle = g.Key.Title,
                                TotalScore = totalScore,
                                Percentage =competitionTotalMark == 0 ? 0 : ((decimal)totalScore / competitionTotalMark) * 100,
                                Days = g.OrderBy(x =>x.CompetitionDay.DayNum)
                                    .Select(x =>
                                        new UserCompetitionDayResultDto
                                        {
                                            SubmissionId = x.Id,
                                            CompetitionDayId = x.CompetitionDayId,
                                            DayTitle = x.CompetitionDay.Title,
                                            DayNum = x.CompetitionDay.DayNum,
                                            Score = x.TotalScore,
                                            Percentage = x.Percentage,
                                            Status = x.Status,
                                            StartedAt = x.StartedAt,
                                            SubmittedAt = x.SubmittedAt,
                                            Responses = x.Responses.OrderBy(r => r.Question.DisplayOrder)
                                                    .Select(r =>
                                                        new UserQuestionResponseDto
                                                        {
                                                            QuestionId = r.QuestionId,
                                                            QuestionTitle = r.Question.Title,
                                                            QuestionType = r.Question.Type,
                                                            QuestionMark =r.Question.QuestionMark,
                                                            AnswerData =r.AnswerData,
                                                            EarnedMark =r.EarnedMark,
                                                            IsCorrect =r.IsCorrect,
                                                            IsManuallyGraded = r.IsManuallyGraded,
                                                            ReviewerComment = r.ReviewerComment,
                                                            ModelAnswer = BuildModelAnswer(r.Question)
                                                        }).ToList()
                                        }).ToList()
                            };
                        }).OrderBy(c => c.CompetitionTitle).ToList();


                return new UserResultsDto
                {
                    UserId = firstSubmission.UserId,
                    UserName = firstSubmission.User.UserName ?? string.Empty,
                    Email = firstSubmission.User.Email ?? string.Empty,
                    Competitions = competitions
                };
            }



            #region Helpers
            private static string? BuildModelAnswer(Question question)
            {
                return question.Type switch
                {
                    QuestionType.MultipleChoice =>BuildMultipleChoiceAnswer(question),
                    QuestionType.ShortAnswer =>question.CorrectAnswer?.AnswerData,
                    QuestionType.LinearScale =>question.CorrectAnswer?.AnswerData,
                    QuestionType.Grid =>BuildGridAnswer(question),
                    QuestionType.Paragraph =>null,
                    _ => null
                };
            }
            private static string? BuildMultipleChoiceAnswer(Question question)
            {
                if (question.CorrectAnswer is null || question.Options is null)
                    return null;

                if (!int.TryParse(question.CorrectAnswer.AnswerData, out int index))
                    return null;

                var option = question.Options.OrderBy(o => o.Id).ElementAtOrDefault(index);
                return option?.Text;
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
