using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Application.Features.Videos.DTOs;

public record VideoDto(
    Guid Id,
    string Title,
    string Description,
    string VideoUrl,
    string? ThumbnailUrl,
    TimeSpan Duration,
    VideoType Type,
    bool IsLive,
    int ViewCount,
    int LikeCount,
    int CommentCount,
    Guid AuthorId,
    string AuthorName,
    Guid? CategoryId,
    string? CategoryName,
    Guid? PlaylistId,
    DateTime CreatedAt
);

public record VideoListDto(
    Guid Id,
    string Title,
    string? ThumbnailUrl,
    TimeSpan Duration,
    VideoType Type,
    bool IsLive,
    int ViewCount,
    int LikeCount,
    Guid AuthorId,
    string AuthorName,
    DateTime CreatedAt
);

public record PlaylistDto(
    Guid Id,
    string Title,
    string Description,
    string? CoverImageUrl,
    bool IsPublic,
    Guid CreatorId,
    string CreatorName,
    int VideoCount,
    DateTime CreatedAt,
    List<VideoListDto> Videos
);

public record PlaylistListDto(
    Guid Id,
    string Title,
    string? CoverImageUrl,
    bool IsPublic,
    Guid CreatorId,
    string CreatorName,
    int VideoCount,
    DateTime CreatedAt
);

public record VideoCategoryDto(
    Guid Id,
    string Name,
    string Description,
    string? IconUrl,
    Guid? ParentCategoryId,
    int VideoCount
);
