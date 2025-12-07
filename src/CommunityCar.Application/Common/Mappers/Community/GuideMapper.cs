using CommunityCar.Application.DTOs.Response.Community.Guides;
using CommunityCar.Domain.Entities.Community.Guides;

namespace CommunityCar.Application.Common.Mappers.Community;

/// <summary>
/// Mapper for Guide entities to DTOs
/// </summary>
public static class GuideMapper
{
    public static GuideDto ToDto(Guide guide, bool isLiked = false, bool isBookmarked = false)
    {
        return new GuideDto(
            Id: guide.Id,
            Title: guide.Title,
            Slug: guide.Slug,
            Description: guide.Description,
            AuthorId: guide.AuthorId,
            AuthorName: guide.Author?.UserName ?? "Unknown",
            AuthorAvatarUrl: guide.Author?.AvatarUrl,
            CoverImageUrl: guide.CoverImageUrl,
            CategoryId: guide.CategoryId,
            CategoryName: guide.Category?.Name,
            Tags: guide.Tags?.Select(t => t.Tag).ToList() ?? [],
            Type: guide.Type,
            Difficulty: guide.Difficulty,
            Status: guide.Status,
            PublishedAt: guide.PublishedAt,
            EstimatedMinutes: guide.EstimatedMinutes,
            CarMake: guide.CarMake,
            CarModel: guide.CarModel,
            CarYearFrom: guide.CarYearFrom,
            CarYearTo: guide.CarYearTo,
            ViewCount: guide.ViewCount,
            LikeCount: guide.LikeCount,
            BookmarkCount: guide.BookmarkCount,
            AverageRating: guide.AverageRating,
            RatingCount: guide.RatingCount,
            IsFeatured: guide.IsFeatured,
            IsVerified: guide.IsVerified,
            IsBookmarkedByCurrentUser: isBookmarked,
            Steps: guide.Steps?.Select(ToStepDto).ToList() ?? [],
            CreatedAt: guide.CreatedAt
        );
    }

    public static GuideListDto ToListDto(Guide guide)
    {
        return new GuideListDto(
            Id: guide.Id,
            Title: guide.Title,
            CoverImageUrl: guide.CoverImageUrl,
            AuthorName: guide.Author?.UserName ?? "Unknown",
            Type: guide.Type,
            Difficulty: guide.Difficulty,
            EstimatedMinutes: guide.EstimatedMinutes,
            AverageRating: guide.AverageRating,
            RatingCount: guide.RatingCount,
            IsVerified: guide.IsVerified
        );
    }

    public static GuideStepDto ToStepDto(GuideStep step)
    {
        return new GuideStepDto(
            Id: step.Id,
            StepNumber: step.StepNumber,
            Title: step.Title,
            Content: step.Content,
            Media: step.Media?.Select(m => new GuideStepMediaDto(
                m.Id,
                m.Url,
                m.ThumbnailUrl,
                m.Caption,
                m.SortOrder
            )).ToList() ?? [],
            Tip: step.Tip,
            Warning: step.Warning,
            ToolsRequired: step.ToolsRequired,
            PartsRequired: step.PartsRequired,
            EstimatedMinutes: step.EstimatedMinutes
        );
    }

    public static GuideRatingDto ToRatingDto(GuideRating rating)
    {
        return new GuideRatingDto(
            Id: rating.Id,
            UserId: rating.UserId,
            UserName: rating.User?.UserName ?? "Unknown",
            Rating: rating.Rating,
            Review: rating.Review,
            IsHelpful: rating.IsHelpful,
            CreatedAt: rating.CreatedAt
        );
    }

    public static GuideCategoryDto ToCategoryDto(GuideCategory category)
    {
        return new GuideCategoryDto(
            Id: category.Id,
            Name: category.Name,
            Slug: category.Slug,
            Description: category.Description,
            ParentId: category.ParentId
        );
    }
}
