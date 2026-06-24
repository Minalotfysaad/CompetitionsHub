using CompetitionsTest.ServiceAbstractions;
using CompetitionsTest.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstraction
{
    public interface IServiceManager
    {
        public ICompetitionService CompetitionService { get; }
        public ICompetitionDayService CompetitionDayService { get; }
        public IQuestionService QuestionService { get; }
        public IAuthService AuthService { get; }
        public ISubmissionService SubmissionService { get; }
        public IGradingService GradingService { get; }
        public IManualGradingService ManualGradingService { get; }
        public ILeaderboardService LeaderboardService { get; }
        public IContestantResultsService ContestantResultsService { get; }
        public ICompetitionDayResultsService CompetitionDayResultsService { get; }

    }
}
