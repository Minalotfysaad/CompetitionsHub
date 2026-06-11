using AutoMapper;
using CompetitionsTest.ServiceAbstractions;
using CompetitionsTest.Services;
using GarasForms.Core;
using ServiceAbstraction;


namespace Services
{
    public class ServiceManager(IUnitOfWork _unitOfWork, IMapper _mapper, IConfiguration _config) : IServiceManager
    {

        // CompetitionDayService Lazy initializing
        private readonly Lazy<ICompetitionDayService> _lazyCompetitionDayService = new Lazy<ICompetitionDayService>(() => new CompetitionDayService(_unitOfWork, _mapper));
        public ICompetitionDayService CompetitionDayService => _lazyCompetitionDayService.Value;

        // QuestionService Lazy initializing
        private readonly Lazy<IQuestionService> _lazyQuestionService = new Lazy<IQuestionService>(() => new QuestionService(_unitOfWork, _mapper));
        public IQuestionService QuestionService => _lazyQuestionService.Value;

    }
}
