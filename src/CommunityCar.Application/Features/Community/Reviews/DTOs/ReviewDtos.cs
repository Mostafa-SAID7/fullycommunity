using CommunityCar.Domain.Entities.Community.Reviews;

namespace CommunityCar.Application.Features.Community.Reviews.DTOs;

public record ReviewDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Title,
    string? Slug,
    string Content,
    ReviewSubjectType SubjectType,
    string? SubjectId,
    string? CarMake,
    string? CarModel,
    int? CarYear,
    string? CarTrim,
    OwnershipStatus? OwnershipStatus,
    int? OwnershipMonths,
    int? MilesDriven,
    int OverallRating,
    int? PerformanceRating,
    int? ComfortRating,
    int? ReliabilityRating,
    int? ValueRating,
    int? FuelEconomyRating,
    int? StyleRating,
    int? TechnologyRating,
    List<string> Pros,
    List<string> Cons,
    string? CoverImageUrl,
    List<ReviewMediaDto> Media,
    ReviewStatus Status,
    DateTime? PublishedAt,
    int ViewCount,
    int HelpfulCount,
    int CommentCount,
    bool IsVerifiedPurchase,
    bool IsExpertReview,
    bool IsFeatured,
    bool? CurrentUserFoundHelpful,
    DateTime CreatedAt
);

public record ReviewMediaDto(Guid Id, string Url, string? ThumbnailUrl, string? Caption);

public record ReviewListDto(
    Guid Id,
    string Title,
    string AuthorName,
    string? AuthorAvatarUrl,
    string? CarMake,
    string? CarModel,
    int? CarYear,
    int OverallRating,
    string? CoverImageUrl,
    int HelpfulCount,
    bool IsVerifiedPurchase,
    bool IsExpertReview,
    DateTime CreatedAt
);

public record CreateReviewRequest(
    string Title,
    string Content,
    ReviewSubjectType SubjectType,
    string? SubjectId,
    string? CarMake,
    string? CarModel,
    int? CarYear,
    string? CarTrim,
    OwnershipStatus? OwnershipStatus,
    int? OwnershipMonths,
    int? MilesDriven,
    int OverallRating,
    int? PerformanceRating,
    int? ComfortRating,
    int? ReliabilityRating,
    int? ValueRating,
    int? FuelEconomyRating,
    int? StyleRating,
    int? TechnologyRating,
    List<string>? Pros,
    List<string>? Cons
);

public record UpdateReviewRequest(
    string? Title,
    string? Content,
    int? OverallRating,
    int? PerformanceRating,
    int? ComfortRating,
    int? ReliabilityRating,
    int? ValueRating,
    List<string>? Pros,
    List<string>? Cons,
    ReviewStatus? Status
);

public record MarkHelpfulRequest(bool IsHelpful);

public record ReviewCommentDto(
    Guid Id,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Content,
    Guid? ParentId,
    int LikeCount,
    DateTime CreatedAt
);
