using AutoMapper;
using CompetitionsTest.Enums;
using CompetitionsTest.Models;
using CompetitionsTest.Models.QuestionModel;
using CompetitionsTest.ServiceAbstractions;
using GarasForms.Core;
using System.Text.Json;

namespace CompetitionsTest.Services;

public class GradingService(IUnitOfWork _unitOfWork): IGradingService
{
    public async Task GradeSubmissionAsync(int submissionId)
    {
        var submissionRepo =_unitOfWork.GetRepository<CompetitionSubmission, int>();

        var submission = await submissionRepo.FindAsync(s => s.Id == submissionId,
            includes:
            [
                "Responses",
                "Responses.Question",
                "Responses.Question.CorrectAnswer",
                "Responses.Question.GridConfiguration",
                "Responses.Question.GridConfiguration.AnswerKeys",
                "CompetitionDay",
                "CompetitionDay.Questions"
            ]);

        if (submission is null)
            throw new Exception("Submission not found");

        bool requiresManualReview = false;

        foreach (var response in submission.Responses)
        {
            var question = response.Question;

            switch (question.Type)
            {
                case QuestionType.MultipleChoice:
                    GradeMultipleChoice(question, response);
                    break;

                case QuestionType.ShortAnswer:
                    GradeShortAnswer(question, response);
                    break;

                case QuestionType.LinearScale:
                    GradeLinearScale(question, response);
                    break;

                case QuestionType.Grid:
                    GradeGrid(question, response);
                    break;

                case QuestionType.Paragraph:
                    response.IsManuallyGraded = false;
                    response.IsCorrect = null;
                    response.EarnedMark = 0;

                    requiresManualReview = true;
                    break;

                default:
                    throw new Exception($"Unsupported question type {question.Type}");
            }
        }

        submission.TotalScore =submission.Responses.Sum(r => r.EarnedMark);

        int totalDayMark = submission.CompetitionDay.Questions.Sum(q => q.QuestionMark);
        submission.Percentage = totalDayMark == 0 ? 0 : ((decimal)submission.TotalScore / totalDayMark) * 100;
        submission.Status = requiresManualReview ? SubmissionStatus.PendingManualReview : SubmissionStatus.Graded;

        submissionRepo.Update(submission);
        await _unitOfWork.SaveChangesAsync();
    }




    #region Helpers
    private static void GradeMultipleChoice(Question question, QuestionResponse response)
    {
        string? correctAnswer = question.CorrectAnswer?.AnswerData;

        bool isCorrect = string.Equals(response.AnswerData?.Trim(), correctAnswer?.Trim(), StringComparison.OrdinalIgnoreCase);
        response.IsCorrect = isCorrect;
        response.EarnedMark = isCorrect ? question.QuestionMark : 0;
    }

    private static void GradeShortAnswer(Question question, QuestionResponse response)
    {
        string? correctAnswer = question.CorrectAnswer?.AnswerData;

        bool isCorrect = string.Equals(response.AnswerData?.Trim(), correctAnswer?.Trim(), StringComparison.OrdinalIgnoreCase);
        response.IsCorrect = isCorrect;
        response.EarnedMark = isCorrect ? question.QuestionMark : 0;
    }

    private static void GradeLinearScale(Question question, QuestionResponse response)
    {
        string? correctAnswer = question.CorrectAnswer?.AnswerData;

        bool isCorrect = string.Equals(response.AnswerData?.Trim(), correctAnswer?.Trim(), StringComparison.OrdinalIgnoreCase);

        response.IsCorrect = isCorrect;
        response.EarnedMark = isCorrect ? question.QuestionMark : 0;
    }

    private static void GradeGrid(Question question, QuestionResponse response)
    {
        try
        {
            var contestantAnswers = JsonSerializer.Deserialize<Dictionary<string, string>>(response.AnswerData ?? "{}");
            if (contestantAnswers is null)
            {
                response.IsCorrect = false;
                response.EarnedMark = 0;
                return;
            }

            var answerKeys = question.GridConfiguration!.AnswerKeys;
            bool allCorrect = true;

            foreach (var answerKey in answerKeys)
            {
                if (!contestantAnswers.TryGetValue(answerKey.RowKey, out string? selectedColumn))
                {
                    allCorrect = false;
                    break;
                }

                if (!string.Equals(selectedColumn, answerKey.ColumnKey, StringComparison.OrdinalIgnoreCase))
                {
                    allCorrect = false;
                    break;
                }
            }

            response.IsCorrect = allCorrect;
            response.EarnedMark = allCorrect ? question.QuestionMark : 0;
        }
        catch
        {
            response.IsCorrect = false;
            response.EarnedMark = 0;
        }
    } 
    #endregion



}