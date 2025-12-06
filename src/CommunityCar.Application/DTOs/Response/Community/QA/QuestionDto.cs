using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;

namespace CommunityCar.Application.DTOs.Response.Community.QA;

public record QuestionDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Title,
    string Content,
    string? Slug,
    QuestionStatus Status,
    Guid? CategoryId,
    string? CategoryName,
    List<string> Tags,
    int ViewCount,
    int AnswerCount,
    int VoteCount,
    int BookmarkCount,
    Guid? AcceptedAnswerId,
    int? BountyPoints,
    DateTime? BountyExpiresAt,
    bool IsClosed,
    int CurrentUserVote,
    bool IsBookmarkedByCurrentUser,
    DateTime CreatedAt
);
