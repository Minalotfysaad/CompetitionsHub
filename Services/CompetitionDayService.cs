using AutoMapper;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using DomainLayer.Contracts;
using GarasForms.Core;

namespace CompetitionsTest.Services
{
    public class CompetitionDayService(IUnitOfWork _unitOfWork, IMapper _mapper) : ICompetitionDayService
    {

    }
}
