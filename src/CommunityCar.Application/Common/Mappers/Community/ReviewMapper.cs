using CommunityCar.Application.DTOs.Response.Community.Reviews;
using CommunityCar.Domain.Entities.Community.Reviews;

namespace CommunityCar.Application.Common.Mappers.Community;

public static class ReviewMapper
{
    public static ReviewDto ToDto(Review review, bool isHelpful = false)
    {
        return new ReviewDto(
            Id: review.Id,
            AuthorId: review.AuthorId,
            AuthorName: review.Author?.UserName ?? "Unknown",
            AuthorAvatarUrl: review.Author?.AvatarUrl,
            Title: review.Title,
            Slug: review.Slug,
            Content: review.Content,
            SubjectType: review.SubjectType,
            SubjectId: review.SubjectId,
            CarMake: review.CarMake,
            CarModel: review.CarModel,
            CarYear: review.CarYear,
            CarTrim: review.CarTrim,
            OwnershipStatus: review.OwnershipStatus,
            OwnershipMonths: review.OwnershipMonths,
            MilesDriven: review.MilesDriven,
            OverallRating: review.OverallRating,
            PerformanceRating: review.PerformanceRating,
            ComfortRating: review.ComfortRating,
            ReliabilityRating: review.ReliabilityRating,
            ValueRating: review.ValueRating,
            FuelEconomyRating: review.FuelEconomyRating,
            StyleRating: review.StyleRating,
            TechnologyRating: review.TechnologyRating,
            Pros: review.Pros?.Select(p => p.Text).ToList() ?? [],
            Cons: review.Cons?.Select(c => c.Text).ToList() ?? [],
            CoverImageUrl: review.CoverImageUrl,
            Media: review.Media?.Select(m => new ReviewMediaDto(m.Id, m.Url, m.ThumbnailUrl, m.Caption)).ToList() ?? [],
            Status: review.Status,
            PublishedAt: review.PublishedAt,
            ViewCount: review.ViewCount,
            HelpfulCount: review.HelpfulCount,
            CommentCount: review.CommentCount,
            IsVerifiedPurchase: review.IsVerifiedPurchase,
            IsExpertReview: review.IsExpertReview,
            IsFeatured: false,
            CurrentUserFoundHelpful: isHelpful,
            CreatedAt: review.CreatedAt
        );
    }

    public static ReviewListDto ToListDto(Review review)
    {
        return new ReviewListDto(
            Id: review.Id,
            Title: review.Title,
            AuthorName: review.Author?.UserName ?? "Unknown",
            AuthorAvatarUrl: review.Author?.AvatarUrl,
            CarMake: review.CarMake,
            CarModel: review.CarModel,
            CarYear: review.CarYear,
            OverallRating: review.OverallRating,
            CoverImageUrl: review.CoverImageUrl,
            HelpfulCount: review.HelpfulCount,
            IsVerifiedPurchase: review.IsVerifiedPurchase,
            IsExpertReview: review.IsExpertReview,
            CreatedAt: review.CreatedAt
        );
    }
}
