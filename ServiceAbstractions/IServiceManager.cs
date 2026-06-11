using CompetitionsTest.ServiceAbstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceAbstraction
{
    public interface IServiceManager
    {
        public ICompetitionDayService CompetitionDayService { get; }
        public IQuestionService QuestionService { get; }
    }
}
