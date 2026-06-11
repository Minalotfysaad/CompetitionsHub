using AutoMapper;
using CompetitionsTest.DTOs.Competition;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using GarasForms.Core;

namespace CompetitionsTest.Services
{
    public class CompetitionService(IUnitOfWork _unitOfWork, IMapper _mapper) : ICompetitionService
    {

        public async Task<CompetitionDto> CreateAsync(CreateCompetitionDto dto)
        {
            var competition = _mapper.Map<Competition>(dto);
            var repo = _unitOfWork.GetRepository<Competition, int>();
            await repo.AddAsync(competition);
            await _unitOfWork.SaveChangesAsync();
            var competitionDto = _mapper.Map<CompetitionDto>(competition);
            return competitionDto;
        }

        public async Task<IEnumerable<CompetitionDto>> GetAllAsync() // with no include for lightweight
        {
            var repo = _unitOfWork.GetRepository<Competition, int>();
            var competitions = await repo.GetAllAsync();
            var competitionDto = _mapper.Map<IEnumerable<CompetitionDto>>(competitions);
            return competitionDto;
        }

        public async Task<CompetitionDto> GetByIdAsync(int id)
        {
            var repo = _unitOfWork.GetRepository<Competition, int>();
            var competition = await repo.FindAsync(
                c => c.Id == id,
                includes: new[] { "Days" });

            if (competition == null)
                throw new Exception($"Competition {id} not found");

            var competitionDto = _mapper.Map<CompetitionDto>(competition);
            return competitionDto;
        }

        public async Task<CompetitionDto> UpdateAsync(int id, UpdateCompetitionDto dto)
        {
            var repo = _unitOfWork.GetRepository<Competition, int>();
            var competition = await repo.GetByIdAsync(id);

            if (competition == null)
                throw new Exception($"Competition {id} not found");

            competition.Title = dto.Title;
            competition.Description = dto.Description;

            repo.Update(competition);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<CompetitionDto>(competition);
        }

        public async Task DeleteAsync(int id)
        {
            var repo = _unitOfWork.GetRepository<Competition, int>();
            var competition = await repo.GetByIdAsync(id);

            if (competition == null)
                throw new Exception($"Competition {id} not found");

            repo.Delete(competition);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
