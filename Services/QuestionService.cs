using AutoMapper;
using CompetitionsTest.DTOs.Question;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using DomainLayer.Contracts;
using GarasForms.Core;

namespace CompetitionsTest.Services
{
    public class QuestionService(IUnitOfWork _unitOfWork, IMapper _mapper) : IQuestionService
    {
        public Task<QuestionDto> CreateAsync(CreateQuestionDto dto)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<QuestionDto>> GetByCompetitionDayAsync(int competitionDayId)
        {
            throw new NotImplementedException();
        }

        public Task<QuestionDto> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<QuestionDto> UpdateAsync(int id, CreateQuestionDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
