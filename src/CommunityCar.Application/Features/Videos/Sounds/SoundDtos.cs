namespace CommunityCar.Application.Features.Videos.Sounds;

public record SoundDto(
    Guid Id,
    string Title,
    string? Artist,
    string? Album,
    string AudioUrl,
    string? CoverImageUrl,
    TimeSpan Duration,
    TimeSpan? ClipStart,
    TimeSpan? ClipEnd,
    bool IsOriginal,
    Guid? OriginalVideoId,
    Guid? CreatorChannelId,
    string? CreatorChannelHandle,
    int UsageCount,
    int FavoriteCount,
    bool IsTrending,
    bool IsFeatured,
    bool IsCopyrighted,
    string? Genre,
    List<string> Tags
);

public record SoundListItemDto(
    Guid Id,
    string Title,
    string? Artist,
    string? CoverImageUrl,
    TimeSpan Duration,
    int UsageCount,
    bool IsTrending
);

public record CreateSoundRequest(
    string Title,
    string? Artist,
    string? Album,
    TimeSpan? ClipStart,
    TimeSpan? ClipEnd,
    Guid? OriginalVideoId,
    string? Genre,
    List<string>? Tags
);

public record SoundSearchRequest(
    string? Keywords,
    string? Genre,
    bool? IsTrending,
    bool? IsFeatured,
    string? SortBy,
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 20
);

public record TrendingSoundDto(
    Guid Id,
    string Title,
    string? Artist,
    string? CoverImageUrl,
    int UsageCount,
    int Rank
);
