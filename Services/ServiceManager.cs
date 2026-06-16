using AutoMapper;
using CompetitionsTest.Models.Identity;
using CompetitionsTest.ServiceAbstractions;
using CompetitionsTest.Services;
using GarasForms.Core;
using Microsoft.AspNetCore.Identity;
using ServiceAbstraction;


namespace Services
{
    public class ServiceManager(IUnitOfWork _unitOfWork, IMapper _mapper, IConfiguration _config, UserManager<ApplicationUser> _userManager) : IServiceManager
    {

        // CompetitionService Lazy initializing
        private readonly Lazy<ICompetitionService> _lazyCompetitionService = new Lazy<ICompetitionService>(() => new CompetitionService(_unitOfWork, _mapper));
        public ICompetitionService CompetitionService => _lazyCompetitionService.Value;

        // CompetitionDayService Lazy initializing
        private readonly Lazy<ICompetitionDayService> _lazyCompetitionDayService = new Lazy<ICompetitionDayService>(() => new CompetitionDayService(_unitOfWork, _mapper));
        public ICompetitionDayService CompetitionDayService => _lazyCompetitionDayService.Value;

        // QuestionService Lazy initializing
        private readonly Lazy<IQuestionService> _lazyQuestionService = new Lazy<IQuestionService>(() => new QuestionService(_unitOfWork, _mapper));
        public IQuestionService QuestionService => _lazyQuestionService.Value;

        // AuthService Lazy initializing
        private readonly Lazy<IAuthService> _lazyAuthService = new Lazy<IAuthService>(() => new AuthService(_userManager));
        public IAuthService AuthService => _lazyAuthService.Value;
    }
}
