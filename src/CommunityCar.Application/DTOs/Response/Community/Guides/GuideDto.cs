using CommunityCar.Domain.Entities.Community.Guides;
using CommunityCar.Domain.Enums.Community.Guides;

namespace CommunityCar.Application.DTOs.Response.Community.Guides;

public record GuideDto(
    Guid Id,
    string Title,
    string? Slug,
    string? Description,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string? CoverImageUrl,
    Guid? CategoryId,
    string? CategoryName,
    List<string> Tags,
    GuideType Type,
    GuideDifficulty Difficulty,
    GuideStatus Status,
    DateTime? PublishedAt,
    int? EstimatedMinutes,
    string? CarMake,
    string? CarModel,
    int? CarYearFrom,
    int? CarYearTo,
    int ViewCount,
    int LikeCount,
    int BookmarkCount,
    decimal AverageRating,
    int RatingCount,
    bool IsFeatured,
    bool IsVerified,
    bool IsBookmarkedByCurrentUser,
    List<GuideStepDto> Steps,
    DateTime CreatedAt
);
