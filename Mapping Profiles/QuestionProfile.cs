using AutoMapper;
using CompetitionsTest.DTOs.Question;
using CompetitionsTest.Models.QuestionModel;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration;
using CompetitionsTest.Models.QuestionModel.QuestionCongifuration.GridQuestion;

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
                    opt => opt.MapFrom(src => src.LinearScaleConfiguration))
                .ForMember(dest => dest.Grid,
                    opt => opt.MapFrom(src => src.GridConfiguration));

            CreateMap<QuestionOption, QuestionOptionDto>();
            CreateMap<LinearScaleConfiguration, LinearScaleDto>();

            CreateMap<GridConfiguration, GridQuestionDto>()
                .ForMember(dest => dest.Rows,
                    opt => opt.MapFrom(src =>
                        src.Rows.Select(r => r.Text)))
                .ForMember(dest => dest.Columns,
                    opt => opt.MapFrom(src =>
                        src.Columns.Select(c => c.Text)))
                .ForMember(dest => dest.AnswerKeys,
                    opt => opt.MapFrom(src => src.AnswerKeys));

            CreateMap<GridAnswerKey, GridAnswerKeyDto>();
        }
    }
}
