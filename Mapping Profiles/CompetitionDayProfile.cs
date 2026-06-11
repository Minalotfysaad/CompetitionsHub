using AutoMapper;
using CompetitionsTest.DTOs.CompetitionDay;
using CompetitionsTest.Models;

namespace CompetitionsTest.Mapping_Profiles
{
    public class CompetitionDayProfile : Profile
    {
        public CompetitionDayProfile()
        {
            CreateMap<CreateCompetitionDayDto, CompetitionDay>();
            CreateMap<UpdateCompetitionDayDto, CompetitionDay>();
            CreateMap<CompetitionDay, CompetitionDayDto>();
        }
    }
}
