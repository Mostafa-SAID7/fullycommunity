namespace CommunityCar.Application.DTOs.Videos;

public record VideoDto(
    Guid Id,
    string Title,
    string Description,
    string VideoUrl,
    string? ThumbnailUrl,
    Guid ChannelId,
    string ChannelName,
    int ViewCount,
    int LikeCount,
    DateTime CreatedAt,
    bool IsPublished
);

public record VideoCategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description
);

public record VideoListItemDto(
    Guid Id,
    string Title,
    string? ThumbnailUrl,
    string ChannelName,
    int ViewCount,
    DateTime CreatedAt
);

public record VideoFeedItemDto(
    Guid Id,
    string Title,
    string Description,
    string VideoUrl,
    string? ThumbnailUrl,
    Guid ChannelId,
    string ChannelName,
    int ViewCount,
    int LikeCount,
    bool IsLiked,
    DateTime CreatedAt
);

public record TrendingHashtagDto(
    string Tag,
    int Count
);
