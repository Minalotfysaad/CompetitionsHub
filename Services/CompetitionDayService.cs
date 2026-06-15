using AutoMapper;
using CompetitionsTest.DTOs.CompetitionDay;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using DomainLayer.Contracts;
using GarasForms.Core;
using GarasForms.Core.Interfaces;

namespace CompetitionsTest.Services
{
    public class CompetitionDayService(IUnitOfWork _unitOfWork, IMapper _mapper) : ICompetitionDayService
    {

        public async Task<CompetitionDayDto> CreateAsync(CreateCompetitionDayDto dto)
        {
            var competitionRepo = _unitOfWork.GetRepository<Competition, int>();
            var competitionDayRepo = _unitOfWork.GetRepository<CompetitionDay, int>();

            // Check competition exists
            var competition = await competitionRepo.GetByIdAsync(dto.CompetitionId);

            if (competition is null)
                throw new Exception("Competition not found");

            // Validate dates
            if (dto.StartDate >= dto.EndDate)
                throw new Exception("Start date must be before end date");

            // Check duplicate DayNum
            var duplicateDay = await competitionDayRepo.FindAsync(d =>
                d.CompetitionId == dto.CompetitionId &&
                d.DayNum == dto.DayNum);

            if (duplicateDay is not null)
                throw new Exception("Day number already exists in this competition");

            // Map DTO to Entity
            var day = _mapper.Map<CompetitionDay>(dto);
            await competitionDayRepo.AddAsync(day);
            await _unitOfWork.SaveChangesAsync();

            // Map Entity to DTO
            var result = _mapper.Map<CompetitionDayDto>(day);
            result.DayTotalMark = 0;

            return result;
        }

        public async Task<CompetitionDayDto> GetByIdAsync(int id)
        {
            var competitionDayRepo = _unitOfWork.GetRepository<CompetitionDay, int>();

            var day = await competitionDayRepo.FindAsync(
                d => d.Id == id,
                includes:
                [
                    "Questions",
                    "Questions.Options",
                    "Questions.CorrectAnswer",
                    "Questions.LinearScaleConfiguration",
                    "Questions.MultipleChoiceGridConfiguration"
                ]);

            if (day is null)
                throw new Exception("Competition day not found");

            var dto = _mapper.Map<CompetitionDayDto>(day);

            dto.DayTotalMark = day.Questions?.Sum(q => q.QuestionMark) ?? 0;

            return dto;
        }

        public async Task<IEnumerable<CompetitionDayDto>> GetByCompetitionIdAsync(int competitionId)
        {
            var competitionDayRepo = _unitOfWork.GetRepository<CompetitionDay, int>();

            var days = await competitionDayRepo.FindAllAsync(
                d => d.CompetitionId == competitionId,
                includes:
                [
                    "Questions",
                    "Questions.Options",
                    "Questions.CorrectAnswer",
                    "Questions.LinearScaleConfiguration",
                    "Questions.MultipleChoiceGridConfiguration"
                ]);

            return days.Select(d =>
            {
                var dto = _mapper.Map<CompetitionDayDto>(d);
                dto.DayTotalMark = d.Questions?.Sum(q => q.QuestionMark) ?? 0;
                return dto;
            });
        }

        public async Task<CompetitionDayDto> UpdateAsync(int id, UpdateCompetitionDayDto dto)
        {
            var competitionDayRepo = _unitOfWork.GetRepository<CompetitionDay, int>();

            var day = await competitionDayRepo.GetByIdAsync(id);

            if (day is null)
                throw new Exception("Competition day not found");

            if (dto.StartDate >= dto.EndDate)
                throw new Exception("Start date must be before end date");

            var duplicate = await competitionDayRepo.FindAsync(d =>
                d.CompetitionId == day.CompetitionId &&
                d.DayNum == dto.DayNum &&
                d.Id != id);

            if (duplicate is not null)
                throw new Exception("Day number already exists");

            // Map DTO to existing entity
            _mapper.Map(dto, day);

            competitionDayRepo.Update(day);
            await _unitOfWork.SaveChangesAsync();

            var result = _mapper.Map<CompetitionDayDto>(day);
            result.DayTotalMark = day.Questions?.Sum(q => q.QuestionMark) ?? 0;

            return result;
        }

        public async Task DeleteAsync(int id)
        {
            var competitionDayRepo = _unitOfWork.GetRepository<CompetitionDay, int>();

            var day = await competitionDayRepo.GetByIdAsync(id);

            if (day is null)
                throw new Exception("Competition day not found");

            competitionDayRepo.Delete(day);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<CompetitionDayDto?> GetActiveDayAsync(int competitionId, DateTime now)
        {
            var competitionDayRepo = _unitOfWork.GetRepository<CompetitionDay, int>();

            var day = await competitionDayRepo.FindAsync(
                d => d.CompetitionId == competitionId &&
                     d.StartDate <= now &&
                     d.EndDate >= now,
               includes:
                [
                    "Questions",
                    "Questions.Options",
                    "Questions.CorrectAnswer",
                    "Questions.LinearScaleConfiguration",
                    "Questions.MultipleChoiceGridConfiguration"
                ]);

            if (day is null)
                return null;

            var dto = _mapper.Map<CompetitionDayDto>(day);
            dto.DayTotalMark = day.Questions?.Sum(q => q.QuestionMark) ?? 0;

            return dto;
        }
    }
}
