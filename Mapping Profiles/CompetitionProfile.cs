using AutoMapper;
using CompetitionsTest.DTOs.Competition;
using CompetitionsTest.Models;

namespace CompetitionsTest.Mapping_Profiles
{
    public class CompetitionProfile : Profile
    {
        public CompetitionProfile()
        {
            CreateMap<CreateCompetitionDto, Competition>();
            CreateMap<Competition, CompetitionDto>();
            CreateMap<Competition, CompetitionListDto>();
            CreateMap<Competition, CompetitionDetailsDto>();
        }
    }
}
