using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;

namespace CommunityCar.Application.Common.Mappers.Community;

/// <summary>
/// Mapper for QA entities to DTOs
/// </summary>
public static class QAMapper
{
    #region Question Mapping

    /// <summary>
    /// Maps Question entity to QuestionDto
    /// </summary>
    public static QuestionDto ToDto(Question question, int currentUserVote = 0, bool isBookmarked = false)
    {
        return new QuestionDto(
            Id: question.Id,
            AuthorId: question.AuthorId,
            AuthorName: question.Author?.FirstName ?? "Unknown",
            AuthorAvatarUrl: question.Author?.AvatarUrl,
            Title: question.Title,
            Content: question.Content,
            Slug: question.Slug,
            Status: question.Status,
            CategoryId: question.CategoryId,
            CategoryName: question.Category?.Name,
            Tags: question.Tags?.Select(t => t.Tag).ToList() ?? [],
            ViewCount: question.ViewCount,
            AnswerCount: question.AnswerCount,
            VoteCount: question.VoteCount,
            BookmarkCount: question.BookmarkCount,
            AcceptedAnswerId: question.AcceptedAnswerId,
            BountyPoints: question.BountyPoints,
            BountyExpiresAt: question.BountyExpiresAt,
            IsClosed: question.IsClosed,
            CurrentUserVote: currentUserVote,
            IsBookmarkedByCurrentUser: isBookmarked,
            CreatedAt: question.CreatedAt
        );
    }

    /// <summary>
    /// Maps Question entity to QuestionListDto
    /// </summary>
    public static QuestionListDto ToListDto(Question question)
    {
        return new QuestionListDto(
            Id: question.Id,
            Title: question.Title,
            AuthorId: question.AuthorId,
            AuthorName: question.Author?.FirstName ?? "Unknown",
            AuthorAvatarUrl: question.Author?.AvatarUrl,
            Status: question.Status,
            AnswerCount: question.AnswerCount,
            VoteCount: question.VoteCount,
            ViewCount: question.ViewCount,
            HasAcceptedAnswer: question.AcceptedAnswerId.HasValue,
            Tags: question.Tags?.Select(t => t.Tag).ToList() ?? [],
            CreatedAt: question.CreatedAt
        );
    }

    /// <summary>
    /// Maps Question entity to TrendingQuestionDto
    /// </summary>
    public static TrendingQuestionDto ToTrendingDto(Question question)
    {
        var content = question.Content.Length > 200 
            ? question.Content.Substring(0, 200) + "..." 
            : question.Content;

        return new TrendingQuestionDto(
            Id: question.Id,
            Title: question.Title,
            Slug: question.Slug ?? question.Id.ToString(),
            Content: content,
            Author: new QuestionAuthorDto(
                Id: question.Author?.Id ?? Guid.Empty,
                FirstName: question.Author?.FirstName ?? "",
                LastName: question.Author?.LastName ?? "",
                AvatarUrl: question.Author?.AvatarUrl,
                UserType: question.Author?.UserType.ToString() ?? "User"
            ),
            VoteCount: question.VoteCount,
            AnswerCount: question.AnswerCount,
            ViewCount: question.ViewCount,
            HasAcceptedAnswer: question.AcceptedAnswerId.HasValue,
            Tags: question.Tags?.Select(t => t.Tag).ToList() ?? [],
            CreatedAt: question.CreatedAt
        );
    }

    #endregion

    #region Answer Mapping

    /// <summary>
    /// Maps Answer entity to AnswerDto
    /// </summary>
    public static AnswerDto ToAnswerDto(Answer answer, int currentUserVote = 0)
    {
        return new AnswerDto(
            Id: answer.Id,
            QuestionId: answer.QuestionId,
            AuthorId: answer.AuthorId,
            AuthorName: answer.Author?.FirstName ?? "Unknown",
            AuthorAvatarUrl: answer.Author?.AvatarUrl,
            Content: answer.Content,
            VoteCount: answer.VoteCount,
            IsAccepted: answer.IsAccepted,
            AcceptedAt: answer.AcceptedAt,
            CurrentUserVote: currentUserVote,
            IsEdited: answer.IsEdited,
            CreatedAt: answer.CreatedAt,
            Comments: answer.Comments?.Select(ToAnswerCommentDto).ToList() ?? []
        );
    }

    /// <summary>
    /// Maps AnswerComment entity to AnswerCommentDto
    /// </summary>
    public static AnswerCommentDto ToAnswerCommentDto(AnswerComment comment)
    {
        return new AnswerCommentDto(
            Id: comment.Id,
            AuthorId: comment.AuthorId,
            AuthorName: comment.Author?.FirstName ?? "Unknown",
            Content: comment.Content,
            CreatedAt: comment.CreatedAt
        );
    }

    #endregion

    #region Category Mapping

    /// <summary>
    /// Maps QuestionCategory entity to QuestionCategoryDto
    /// </summary>
    public static QuestionCategoryDto ToCategoryDto(QuestionCategory category)
    {
        return new QuestionCategoryDto(
            Id: category.Id,
            Name: category.Name,
            Slug: category.Slug,
            Description: category.Description,
            QuestionCount: category.QuestionCount
        );
    }

    #endregion
}
