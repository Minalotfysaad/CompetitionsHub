using AutoMapper;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using DomainLayer.Contracts;
using GarasForms.Core;

namespace CompetitionsTest.Services
{
    public class QuestionService(IUnitOfWork _unitOfWork, IMapper _mapper) : IQuestionService
    {

    }
}
