using CommunityCar.Domain.Entities.Community.Guides;

namespace CommunityCar.Application.Features.Community.Guides.DTOs;

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

public record GuideListDto(
    Guid Id,
    string Title,
    string? CoverImageUrl,
    string AuthorName,
    GuideType Type,
    GuideDifficulty Difficulty,
    int? EstimatedMinutes,
    decimal AverageRating,
    int RatingCount,
    bool IsVerified
);

public record GuideStepDto(
    Guid Id,
    int StepNumber,
    string Title,
    string Content,
    List<GuideStepMediaDto> Media,
    string? Tip,
    string? Warning,
    string? ToolsRequired,
    string? PartsRequired,
    int? EstimatedMinutes
);

public record GuideStepMediaDto(Guid Id, string Url, string? ThumbnailUrl, string? Caption, int SortOrder);

public record CreateGuideRequest(
    string Title,
    string? Description,
    Guid? CategoryId,
    List<string>? Tags,
    GuideType Type,
    GuideDifficulty Difficulty,
    int? EstimatedMinutes,
    string? CarMake,
    string? CarModel,
    int? CarYearFrom,
    int? CarYearTo,
    List<CreateGuideStepRequest> Steps
);

public record CreateGuideStepRequest(
    int StepNumber,
    string Title,
    string Content,
    string? Tip,
    string? Warning,
    string? ToolsRequired,
    string? PartsRequired,
    int? EstimatedMinutes
);

public record UpdateGuideRequest(
    string? Title,
    string? Description,
    Guid? CategoryId,
    List<string>? Tags,
    GuideDifficulty? Difficulty,
    int? EstimatedMinutes,
    GuideStatus? Status
);

public record GuideRatingDto(
    Guid Id,
    Guid UserId,
    string UserName,
    int Rating,
    string? Review,
    bool IsHelpful,
    DateTime CreatedAt
);

public record CreateGuideRatingRequest(int Rating, string? Review, bool IsHelpful);

public record GuideCategoryDto(Guid Id, string Name, string? Slug, string? Description, Guid? ParentId);
