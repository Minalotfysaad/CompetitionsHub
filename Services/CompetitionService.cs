using AutoMapper;
using CompetitionsTest.DTOs;
using CompetitionsTest.DTOs.Competition;
using CompetitionsTest.Helpers;
using CompetitionsTest.Models;
using CompetitionsTest.ServiceAbstractions;
using GarasForms.Core;
using GarasForms.Core.Helpers;

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

        //public async Task<IEnumerable<CompetitionListDto>> GetAllAsync()
        //{
        //    var repo = _unitOfWork.GetRepository<Competition, int>();
        //    var competitions = await repo.GetAllAsync();

        //    return _mapper.Map<IEnumerable<CompetitionListDto>>(competitions);
        //}

        public async Task<PaginationResponse<CompetitionListDto>> GetAllAsync(CompetitionQueryParams queryParams)
        {
            var repo = _unitOfWork.GetRepository<Competition, int>();

            var competitions = await repo.FindAllPagingAsync(
                c => true,
                queryParams.PageNumber,
                queryParams.PageSize,
                includes: new[] { "Days" },
                orderBy: c => c.Id);

            var dtoItems = _mapper.Map<IEnumerable<CompetitionListDto>>(competitions);
            return new PaginationResponse<CompetitionListDto>
            {
                Items = dtoItems,
                CurrentPage = competitions.CurrentPage,
                TotalPages = competitions.TotalPages,
                PageSize = competitions.PageSize,
                TotalCount = competitions.TotalCount,
                StartFrom = competitions.StartFrom,
                EndTo = competitions.EndTo
            };
        }

        public async Task<PaginationResponse<CompetitionListDto>> GetActiveCompetitionsAsync(CompetitionQueryParams queryParams)
        {
            var repo = _unitOfWork.GetRepository<Competition, int>();
            var now = DateTime.UtcNow;

            var competitions = await repo.FindAllPagingAsync(
                c => c.Days.Any() && now >= c.Days.Min(d => d.StartDate) && now <= c.Days.Max(d => d.EndDate),
                queryParams.PageNumber,
                queryParams.PageSize,
                includes: new[] { "Days" },
                orderBy: c => c.Id);

            var dtoItems = _mapper.Map<IEnumerable<CompetitionListDto>>(competitions);
            return new PaginationResponse<CompetitionListDto>
            {
                Items = dtoItems,
                CurrentPage = competitions.CurrentPage,
                TotalPages = competitions.TotalPages,
                PageSize = competitions.PageSize,
                TotalCount = competitions.TotalCount,
                StartFrom = competitions.StartFrom,
                EndTo = competitions.EndTo
            };
        }


        public async Task<CompetitionDetailsDto> GetByIdAsync(int id)
        {
            var repo = _unitOfWork.GetRepository<Competition, int>();

            var competition = await repo.FindAsync(
                c => c.Id == id,
                includes: new[] { 
                    "Days",
                    "Days.Questions",
                    "Days.Questions.Options",
                    "Days.Questions.LinearScaleConfiguration",
                    "Days.Questions.GridConfiguration",
                    "Days.Questions.GridConfiguration.Rows",
                    "Days.Questions.GridConfiguration.Columns",
                    "Days.Questions.GridConfiguration.AnswerKeys"
                });

            if (competition is null)
                throw new Exception($"Competition {id} not found");

            return _mapper.Map<CompetitionDetailsDto>(competition);
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
