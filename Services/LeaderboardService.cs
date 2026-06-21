using CompetitionsTest.DTOs.Leaderboard;
using CompetitionsTest.Enums;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using GarasForms.Core;

namespace CompetitionsTest.Services
{
    public class LeaderboardService(IUnitOfWork _unitOfWork): ILeaderboardService
    {
        public async Task<CompetitionDayLeaderboardDto>GetCompetitionDayLeaderboardAsync(int competitionDayId)
        {
            var dayRepo =_unitOfWork.GetRepository<CompetitionDay, int>();
            var submissionRepo =_unitOfWork.GetRepository<CompetitionSubmission, int>();
            var day = await dayRepo.GetByIdAsync(competitionDayId);

            if (day is null)
                throw new Exception("Competition day not found");


            var submissions = await submissionRepo.FindAllAsync(s =>
                    s.CompetitionDayId == competitionDayId &&
                    s.Status == SubmissionStatus.Graded,
                    includes:["User"]);


            var orderedSubmissions = submissions.OrderByDescending(s => s.TotalScore)
                .ThenBy(s => s.SubmittedAt)
                .ToList();

            var rankings = BuildDayRanks(orderedSubmissions);
            return new CompetitionDayLeaderboardDto
            {
                CompetitionDayId = day.Id,
                DayNum = day.DayNum,
                Rankings = rankings
            };
        }



        public async Task<CompetitionLeaderboardDto>GetCompetitionLeaderboardAsync(int competitionId)
        {
            var competitionRepo =_unitOfWork.GetRepository<Competition, int>();
            var submissionRepo =_unitOfWork.GetRepository<CompetitionSubmission, int>();

            var competition = await competitionRepo.FindAsync(
                c => c.Id == competitionId,
                includes:
                ["Days","Days.Questions"]);

            if (competition is null)
                throw new Exception("Competition not found");

            int competitionTotalMarks =competition.Days.Sum(d =>d.Questions.Sum(q => q.QuestionMark));

            var submissions = await submissionRepo.FindAllAsync(s =>
                    s.Status == SubmissionStatus.Graded &&
                    s.CompetitionDay.CompetitionId == competitionId,
                includes:["User","CompetitionDay"]);


            var contestantScores = submissions.GroupBy(s => new
                {
                    s.UserId,
                    UserName = s.User.UserName ?? string.Empty
                })
                .Select(g => new CompetitionRankingDto
                {
                    UserId = g.Key.UserId,
                    UserName = g.Key.UserName,
                    TotalScore = g.Sum(x => x.TotalScore),

                    Percentage =competitionTotalMarks == 0 ? 0: ((decimal)g.Sum(x => x.TotalScore)/competitionTotalMarks) * 100
                })
                .OrderByDescending(x => x.TotalScore)
                .ThenBy(x => x.UserName)
                .ToList();

            ApplyCompetitionRanks(contestantScores);


            return new CompetitionLeaderboardDto
            {
                CompetitionId = competition.Id,
                CompetitionTitle = competition.Title,
                Rankings = contestantScores
            };
        }



        #region Helpers

        private static List<CompetitionDayRankingDto>BuildDayRanks(List<CompetitionSubmission> submissions)
        {
            var rankings =new List<CompetitionDayRankingDto>();
            int currentRank = 0;
            int position = 0;
            int? previousScore = null;

            foreach (var submission in submissions)
            {
                position++;
                if (previousScore != submission.TotalScore)
                {
                    currentRank = position;
                    previousScore = submission.TotalScore;
                }

                rankings.Add(new CompetitionDayRankingDto
                    {
                        Rank = currentRank,
                        UserId = submission.UserId,
                        UserName = submission.User.UserName ?? string.Empty,
                        Score = submission.TotalScore,
                        Percentage = submission.Percentage
                    });
            }

            return rankings;
        }

        private static void ApplyCompetitionRanks(List<CompetitionRankingDto> rankings)
        {
            int currentRank = 0;
            int position = 0;
            int? previousScore = null;

            foreach (var ranking in rankings)
            {
                position++;

                if (previousScore != ranking.TotalScore)
                {
                    currentRank = position;
                    previousScore = ranking.TotalScore;
                }

                ranking.Rank = currentRank;
            }
        }

        #endregion
    }
}
