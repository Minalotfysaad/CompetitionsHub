using AutoMapper;
using CompetitionsTest.DTOs.Submission;
using CompetitionsTest.Models;

namespace CompetitionsTest.Mapping_Profiles
{
    public class SubmissionProfile : Profile
    {
        public SubmissionProfile()
        {
            CreateMap<CompetitionSubmission, SubmissionDto>();

            CreateMap<QuestionResponse, QuestionResponseDto>();
        }
    }
}
