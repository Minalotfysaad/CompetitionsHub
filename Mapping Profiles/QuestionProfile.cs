using AutoMapper;
using CompetitionsTest.DTOs.Question;
using CompetitionsTest.Models.QuestionModel;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration;

namespace CompetitionsTest.Mapping_Profiles
{
    public class QuestionProfile : Profile
    {
        public QuestionProfile()
        {
            CreateMap<Question, QuestionDto>()
                .ForMember(dest => dest.CorrectAnswer,
                    opt => opt.MapFrom(src => src.CorrectAnswer != null ? src.CorrectAnswer.AnswerData : null))
                .ForMember(dest => dest.Options,
                    opt => opt.MapFrom(src => src.Options))
                .ForMember(dest => dest.LinearScale,
                    opt => opt.MapFrom(src => src.LinearScaleConfiguration));

            CreateMap<QuestionOption, QuestionOptionDto>();
            CreateMap<LinearScaleConfiguration, LinearScaleDto>();
        }
    }
}
