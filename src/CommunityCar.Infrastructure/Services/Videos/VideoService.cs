using CommunityCar.Application.Common.Interfaces.Videos;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.Content;
using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Domain.Entities.Videos.Content;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Videos;

public class VideoService : IVideoService
{
    private readonly AppDbContext _context;

    public VideoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<VideoDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>()
            .Include(v => v.Channel)
            .FirstOrDefaultAsync(v => v.Id == id && !v.IsDeleted, ct);
        return video == null ? null : MapToDto(video);
    }

    public async Task<VideoDto?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>()
            .Include(v => v.Channel)
            .FirstOrDefaultAsync(v => v.Slug == slug && !v.IsDeleted, ct);
        return video == null ? null : MapToDto(video);
    }

    public async Task<PagedResult<VideoListItemDto>> SearchAsync(VideoSearchRequest request, CancellationToken ct = default)
    {
        var query = _context.Set<Video>()
            .Include(v => v.Channel)
            .Where(v => !v.IsDeleted && v.Status == VideoStatus.Published);

        if (!string.IsNullOrEmpty(request.Keywords))
            query = query.Where(v => v.Title.Contains(request.Keywords) || (v.Description != null && v.Description.Contains(request.Keywords)));

        if (request.Type.HasValue)
            query = query.Where(v => v.Type == request.Type.Value);

        if (request.ChannelId.HasValue)
            query = query.Where(v => v.ChannelId == request.ChannelId.Value);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(v => v.PublishedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(v => MapToListItem(v))
            .ToListAsync(ct);

        return new PagedResult<VideoListItemDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PagedResult<VideoFeedItemDto>> GetFeedAsync(Guid? userId, VideoFeedRequest request, CancellationToken ct = default)
    {
        var query = _context.Set<Video>()
            .Include(v => v.Channel)
            .Where(v => !v.IsDeleted && v.Status == VideoStatus.Published);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(v => v.ViewCount)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(v => MapToFeedItem(v))
            .ToListAsync(ct);

        return new PagedResult<VideoFeedItemDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<PagedResult<VideoListItemDto>> GetChannelVideosAsync(Guid channelId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.Set<Video>()
            .Include(v => v.Channel)
            .Where(v => v.ChannelId == channelId && !v.IsDeleted && v.Status == VideoStatus.Published);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(v => v.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => MapToListItem(v))
            .ToListAsync(ct);

        return new PagedResult<VideoListItemDto>(items, total, page, pageSize);
    }

    public async Task<List<VideoListItemDto>> GetTrendingAsync(int count = 20, CancellationToken ct = default)
    {
        return await _context.Set<Video>()
            .Include(v => v.Channel)
            .Where(v => !v.IsDeleted && v.Status == VideoStatus.Published)
            .OrderByDescending(v => v.ViewCount)
            .Take(count)
            .Select(v => MapToListItem(v))
            .ToListAsync(ct);
    }

    public async Task<List<VideoListItemDto>> GetRelatedAsync(Guid videoId, int count = 10, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>().FindAsync(new object[] { videoId }, ct);
        if (video == null) return new List<VideoListItemDto>();

        return await _context.Set<Video>()
            .Include(v => v.Channel)
            .Where(v => !v.IsDeleted && v.Status == VideoStatus.Published && v.Id != videoId && v.CategoryId == video.CategoryId)
            .OrderByDescending(v => v.ViewCount)
            .Take(count)
            .Select(v => MapToListItem(v))
            .ToListAsync(ct);
    }

    public Task<List<TrendingHashtagDto>> GetTrendingHashtagsAsync(int count = 20, CancellationToken ct = default)
    {
        var hashtags = new List<TrendingHashtagDto>
        {
            new("CarMeet", 1250, 5000000, 1),
            new("ClassicCars", 980, 4200000, 2),
            new("CarRestoration", 850, 3800000, 3),
            new("MuscleCar", 720, 3200000, 4),
            new("JDM", 650, 2900000, 5)
        };
        return Task.FromResult(hashtags.Take(count).ToList());
    }

    public Task<List<VideoCategoryDto>> GetCategoriesAsync(CancellationToken ct = default)
    {
        var categories = new List<VideoCategoryDto>
        {
            new(Guid.NewGuid(), "Restoration", "Classic car restoration videos", "restoration", "https://example.com/icons/restoration.png", 150, true),
            new(Guid.NewGuid(), "Reviews", "Car reviews and comparisons", "reviews", "https://example.com/icons/reviews.png", 280, true),
            new(Guid.NewGuid(), "DIY & How-To", "DIY maintenance and repair guides", "diy", "https://example.com/icons/diy.png", 420, true),
            new(Guid.NewGuid(), "Car Meets", "Car shows and meetups", "meets", "https://example.com/icons/meets.png", 95, false),
            new(Guid.NewGuid(), "Racing", "Racing and track content", "racing", "https://example.com/icons/racing.png", 180, false)
        };
        return Task.FromResult(categories);
    }

    public Task<VideoUploadResponse> InitiateUploadAsync(Guid channelId, CreateVideoRequest request, CancellationToken ct = default)
    {
        var videoId = Guid.NewGuid();
        return Task.FromResult(new VideoUploadResponse(
            videoId,
            $"/uploads/{videoId}",
            $"/uploads/{videoId}/thumbnail",
            DateTime.UtcNow.AddHours(1)
        ));
    }

    public async Task<VideoDto> CompleteUploadAsync(Guid videoId, string videoUrl, string? thumbnailUrl, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>()
            .Include(v => v.Channel)
            .FirstOrDefaultAsync(v => v.Id == videoId, ct);
        if (video == null) throw new Exception("Video not found");

        video.VideoUrl = videoUrl;
        video.ThumbnailUrl = thumbnailUrl;
        video.Status = VideoStatus.Published;
        video.PublishedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return MapToDto(video);
    }

    public async Task<VideoDto> UpdateAsync(Guid id, UpdateVideoRequest request, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>()
            .Include(v => v.Channel)
            .FirstOrDefaultAsync(v => v.Id == id, ct);
        if (video == null) throw new Exception("Video not found");

        if (request.Title != null) video.Title = request.Title;
        if (request.Description != null) video.Description = request.Description;

        await _context.SaveChangesAsync(ct);
        return MapToDto(video);
    }

    public async Task PublishAsync(Guid id, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>().FindAsync(new object[] { id }, ct);
        if (video != null)
        {
            video.Status = VideoStatus.Published;
            video.PublishedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task UnpublishAsync(Guid id, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>().FindAsync(new object[] { id }, ct);
        if (video != null)
        {
            video.Status = VideoStatus.Draft;
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>().FindAsync(new object[] { id }, ct);
        if (video != null)
        {
            video.IsDeleted = true;
            await _context.SaveChangesAsync(ct);
        }
    }

    public Task RecordViewAsync(Guid videoId, Guid? userId, string? sessionId, string? ipAddress, CancellationToken ct = default)
        => Task.CompletedTask;

    public Task UpdateWatchProgressAsync(Guid videoId, Guid? userId, TimeSpan watchDuration, double watchPercent, CancellationToken ct = default)
        => Task.CompletedTask;

    private static VideoDto MapToDto(Video v) => new(
        Id: v.Id,
        ChannelId: v.ChannelId,
        ChannelHandle: v.Channel?.Handle ?? "",
        ChannelDisplayName: v.Channel?.DisplayName ?? "",
        ChannelAvatarUrl: v.Channel?.AvatarUrl,
        ChannelIsVerified: v.Channel?.IsVerified ?? false,
        Title: v.Title,
        Description: v.Description,
        Slug: v.Slug,
        VideoUrl: v.VideoUrl,
        ThumbnailUrl: v.ThumbnailUrl,
        PreviewGifUrl: v.PreviewGifUrl,
        Duration: v.Duration,
        Width: v.Width,
        Height: v.Height,
        Orientation: v.Orientation,
        AvailableQualities: v.AvailableQualities,
        Type: v.Type,
        Status: v.Status,
        Visibility: v.Visibility,
        ContentRating: v.ContentRating,
        PublishedAt: v.PublishedAt,
        CategoryName: null,
        Tags: v.Tags,
        Hashtags: v.Hashtags,
        LocationName: v.LocationName,
        ViewCount: v.ViewCount,
        LikeCount: v.LikeCount,
        CommentCount: v.CommentCount,
        ShareCount: v.ShareCount,
        SaveCount: v.SaveCount,
        AllowComments: v.AllowComments,
        AllowDuets: v.AllowDuets,
        AllowDownloads: v.AllowDownloads,
        IsMonetized: v.IsMonetized,
        IsSponsoredContent: v.IsSponsoredContent,
        SponsorName: v.SponsorName,
        SoundId: v.SoundId,
        SoundTitle: null,
        SoundArtist: null,
        DuetOfVideoId: v.DuetOfVideoId,
        StitchOfVideoId: v.StitchOfVideoId,
        HasAutoGeneratedCaptions: v.HasAutoGeneratedCaptions,
        CreatedAt: v.CreatedAt
    );

    private static VideoListItemDto MapToListItem(Video v) => new(
        Id: v.Id,
        Title: v.Title,
        ThumbnailUrl: v.ThumbnailUrl,
        Duration: v.Duration,
        Type: v.Type,
        ChannelHandle: v.Channel?.Handle ?? "",
        ChannelDisplayName: v.Channel?.DisplayName ?? "",
        ChannelAvatarUrl: v.Channel?.AvatarUrl,
        ChannelIsVerified: v.Channel?.IsVerified ?? false,
        ViewCount: v.ViewCount,
        LikeCount: v.LikeCount,
        PublishedAt: v.PublishedAt
    );

    private static VideoFeedItemDto MapToFeedItem(Video v) => new(
        Id: v.Id,
        Title: v.Title,
        Description: v.Description,
        VideoUrl: v.VideoUrl,
        ThumbnailUrl: v.ThumbnailUrl,
        Duration: v.Duration,
        Type: v.Type,
        Orientation: v.Orientation,
        ChannelId: v.ChannelId,
        ChannelHandle: v.Channel?.Handle ?? "",
        ChannelDisplayName: v.Channel?.DisplayName ?? "",
        ChannelAvatarUrl: v.Channel?.AvatarUrl,
        ChannelIsVerified: v.Channel?.IsVerified ?? false,
        ViewCount: v.ViewCount,
        LikeCount: v.LikeCount,
        CommentCount: v.CommentCount,
        ShareCount: v.ShareCount,
        IsLikedByUser: false,
        IsSavedByUser: false,
        IsFollowingChannel: false,
        SoundId: v.SoundId,
        SoundTitle: null,
        Hashtags: v.Hashtags,
        PublishedAt: v.PublishedAt
    );
}
