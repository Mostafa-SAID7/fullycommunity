using AutoMapper;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Application.Common.Mappings.Community.QA;

public class QAMappingProfile : Profile
{
    public QAMappingProfile()
    {
        // Question mappings
        CreateMap<Question, QuestionDto>()
            .ForMember(d => d.AuthorName, opt => opt.MapFrom(s => $"{s.Author.FirstName} {s.Author.LastName}".Trim()))
            .ForMember(d => d.AuthorAvatarUrl, opt => opt.MapFrom(s => s.Author.AvatarUrl))
            .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category != null ? s.Category.Name : null))
            .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.Tags.Select(t => t.Tag).ToList()))
            .ForMember(d => d.CurrentUserVote, opt => opt.Ignore())
            .ForMember(d => d.IsBookmarkedByCurrentUser, opt => opt.Ignore());

        CreateMap<Question, QuestionListDto>()
            .ForMember(d => d.AuthorName, opt => opt.MapFrom(s => $"{s.Author.FirstName} {s.Author.LastName}".Trim()))
            .ForMember(d => d.AuthorAvatarUrl, opt => opt.MapFrom(s => s.Author.AvatarUrl))
            .ForMember(d => d.HasAcceptedAnswer, opt => opt.MapFrom(s => s.AcceptedAnswerId != null))
            .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.Tags.Select(t => t.Tag).ToList()));

        CreateMap<Question, TrendingQuestionDto>()
            .ForMember(d => d.Slug, opt => opt.MapFrom(s => s.Slug ?? s.Id.ToString()))
            .ForMember(d => d.Author, opt => opt.MapFrom(s => new QuestionAuthorDto(
                s.Author.Id,
                s.Author.FirstName ?? "",
                s.Author.LastName ?? "",
                s.Author.AvatarUrl,
                s.Author.UserType.ToString()
            )))
            .ForMember(d => d.HasAcceptedAnswer, opt => opt.MapFrom(s => s.AcceptedAnswerId != null))
            .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.Tags.Select(t => t.Tag).ToList()));

        CreateMap<CreateQuestionRequest, Question>()
            .ForMember(d => d.Tags, opt => opt.MapFrom(s => s.Tags != null 
                ? s.Tags.Select(tag => new QuestionTag { Tag = tag }).ToList() 
                : new List<QuestionTag>()));

        // Answer mappings
        CreateMap<Answer, AnswerDto>()
            .ForMember(d => d.AuthorName, opt => opt.MapFrom(s => $"{s.Author.FirstName} {s.Author.LastName}".Trim()))
            .ForMember(d => d.AuthorAvatarUrl, opt => opt.MapFrom(s => s.Author.AvatarUrl))
            .ForMember(d => d.CurrentUserVote, opt => opt.Ignore())
            .ForMember(d => d.Comments, opt => opt.MapFrom(s => s.Comments));

        CreateMap<CreateAnswerRequest, Answer>();
        CreateMap<UpdateAnswerRequest, Answer>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Answer Comment mappings
        CreateMap<AnswerComment, AnswerCommentDto>()
            .ForMember(d => d.AuthorName, opt => opt.MapFrom(s => $"{s.Author.FirstName} {s.Author.LastName}".Trim()));

        // Category mappings
        CreateMap<QuestionCategory, QuestionCategoryDto>();
    }
}
