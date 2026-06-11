using AutoMapper;
using CompetitionsTest.DTOs.QuestionDto;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using DomainLayer.Contracts;
using GarasForms.Core;

namespace CompetitionsTest.Services
{
    public class QuestionService(IUnitOfWork _unitOfWork, IMapper _mapper) : IQuestionService
    {

        public async Task<IReadOnlyList<QuestionDto>> GetQuestionsByCompetitionDayAsync(int dayId)
        {
            throw new NotImplementedException();
        }
        public Task<QuestionDto> CreateAsync(QuestionDto dto)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<QuestionDto?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }


        public Task<QuestionDto> UpdateAsync(int id, QuestionDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
