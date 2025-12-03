using CommunityCar.Application.Common.Interfaces.Videos;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.Content;
using CommunityCar.Domain.Entities.Videos.Content;
using CommunityCar.Domain.Entities.Videos.Common;
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
            .Include(v => v.Category)
            .FirstOrDefaultAsync(v => v.Id == id && !v.IsDeleted, ct);

        return video == null ? null : MapToDto(video);
    }

    public async Task<VideoDto?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>()
            .Include(v => v.Channel)
            .Include(v => v.Category)
            .FirstOrDefaultAsync(v => v.Slug == slug && !v.IsDeleted, ct);

        return video == null ? null : MapToDto(video);
    }

    public async Task<PagedResult<VideoListItemDto>> SearchAsync(VideoSearchRequest request, CancellationToken ct = default)
    {
        var query = _context.Set<Video>()
            .Include(v => v.Channel)
            .Where(v => !v.IsDeleted && v.Status == VideoStatus.Published);

        if (!string.IsNullOrEmpty(request.Query))
            query = query.Where(v => v.Title.Contains(request.Query) || (v.Description != null && v.Description.Contains(request.Query)));

        if (request.CategoryId.HasValue)
            query = query.Where(v => v.CategoryId == request.CategoryId);

        if (request.ChannelId.HasValue)
            query = query.Where(v => v.ChannelId == request.ChannelId);

        if (request.Type.HasValue)
            query = query.Where(v => v.Type == request.Type);

        var total = await query.CountAsync(ct);
        var page = request.Page ?? 1;
        var pageSize = request.PageSize ?? 20;

        var items = await query
            .OrderByDescending(v => v.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new VideoListItemDto
            {
                Id = v.Id,
                Title = v.Title,
                Slug = v.Slug,
                ThumbnailUrl = v.ThumbnailUrl,
                Duration = v.Duration,
                ViewCount = v.ViewCount,
                LikeCount = v.LikeCount,
                Type = v.Type.ToString(),
                PublishedAt = v.PublishedAt,
                ChannelId = v.ChannelId,
                ChannelHandle = v.Channel.Handle,
                ChannelName = v.Channel.DisplayName,
                ChannelAvatarUrl = v.Channel.AvatarUrl,
                IsVerified = v.Channel.IsVerified
            })
            .ToListAsync(ct);

        return new PagedResult<VideoListItemDto>(items, total, page, pageSize);
    }

    public async Task<PagedResult<VideoFeedItemDto>> GetFeedAsync(Guid? userId, VideoFeedRequest request, CancellationToken ct = default)
    {
        var query = _context.Set<Video>()
            .Include(v => v.Channel)
            .Where(v => !v.IsDeleted && v.Status == VideoStatus.Published);

        var page = request.Page ?? 1;
        var pageSize = request.PageSize ?? 20;

        query = request.FeedType switch
        {
            "Trending" => query.OrderByDescending(v => v.ViewCount),
            "New" => query.OrderByDescending(v => v.PublishedAt),
            _ => query.OrderByDescending(v => v.PublishedAt)
        };

        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new VideoFeedItemDto
            {
                Id = v.Id,
                Title = v.Title,
                Slug = v.Slug,
                Description = v.Description,
                ThumbnailUrl = v.ThumbnailUrl,
                VideoUrl = v.VideoUrl,
                Duration = v.Duration,
                ViewCount = v.ViewCount,
                LikeCount = v.LikeCount,
                CommentCount = v.CommentCount,
                Type = v.Type.ToString(),
                PublishedAt = v.PublishedAt,
                ChannelId = v.ChannelId,
                ChannelHandle = v.Channel.Handle,
                ChannelName = v.Channel.DisplayName,
                ChannelAvatarUrl = v.Channel.AvatarUrl,
                IsVerified = v.Channel.IsVerified
            })
            .ToListAsync(ct);

        return new PagedResult<VideoFeedItemDto>(items, total, page, pageSize);
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
            .Select(v => new VideoListItemDto
            {
                Id = v.Id,
                Title = v.Title,
                Slug = v.Slug,
                ThumbnailUrl = v.ThumbnailUrl,
                Duration = v.Duration,
                ViewCount = v.ViewCount,
                LikeCount = v.LikeCount,
                Type = v.Type.ToString(),
                PublishedAt = v.PublishedAt,
                ChannelId = v.ChannelId,
                ChannelHandle = v.Channel.Handle,
                ChannelName = v.Channel.DisplayName,
                ChannelAvatarUrl = v.Channel.AvatarUrl,
                IsVerified = v.Channel.IsVerified
            })
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
            .Select(v => new VideoListItemDto
            {
                Id = v.Id,
                Title = v.Title,
                Slug = v.Slug,
                ThumbnailUrl = v.ThumbnailUrl,
                Duration = v.Duration,
                ViewCount = v.ViewCount,
                LikeCount = v.LikeCount,
                Type = v.Type.ToString(),
                PublishedAt = v.PublishedAt,
                ChannelId = v.ChannelId,
                ChannelHandle = v.Channel.Handle,
                ChannelName = v.Channel.DisplayName,
                ChannelAvatarUrl = v.Channel.AvatarUrl,
                IsVerified = v.Channel.IsVerified
            })
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
            .Select(v => new VideoListItemDto
            {
                Id = v.Id,
                Title = v.Title,
                Slug = v.Slug,
                ThumbnailUrl = v.ThumbnailUrl,
                Duration = v.Duration,
                ViewCount = v.ViewCount,
                LikeCount = v.LikeCount,
                Type = v.Type.ToString(),
                PublishedAt = v.PublishedAt,
                ChannelId = v.ChannelId,
                ChannelHandle = v.Channel.Handle,
                ChannelName = v.Channel.DisplayName,
                ChannelAvatarUrl = v.Channel.AvatarUrl,
                IsVerified = v.Channel.IsVerified
            })
            .ToListAsync(ct);
    }

    public async Task<List<TrendingHashtagDto>> GetTrendingHashtagsAsync(int count = 20, CancellationToken ct = default)
    {
        // Simple implementation - return hashtags from recent videos
        var videos = await _context.Set<Video>()
            .Where(v => !v.IsDeleted && v.Status == VideoStatus.Published)
            .OrderByDescending(v => v.ViewCount)
            .Take(100)
            .ToListAsync(ct);

        var hashtags = videos
            .SelectMany(v => v.Hashtags ?? new List<string>())
            .GroupBy(h => h.TrimStart('#').ToLower())
            .Select(g => new TrendingHashtagDto { Hashtag = g.Key, Count = g.Count() })
            .OrderByDescending(h => h.Count)
            .Take(count)
            .ToList();

        return hashtags;
    }

    public async Task<List<VideoCategoryDto>> GetCategoriesAsync(CancellationToken ct = default)
    {
        return await _context.Set<VideoCategory>()
            .Where(c => c.IsActive && !c.IsDeleted)
            .OrderBy(c => c.SortOrder)
            .Select(c => new VideoCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug ?? "",
                IconUrl = c.IconUrl,
                VideoCount = c.VideoCount
            })
            .ToListAsync(ct);
    }


    // Upload & Management methods (stub implementations)
    public Task<VideoUploadResponse> InitiateUploadAsync(Guid channelId, CreateVideoRequest request, CancellationToken ct = default)
    {
        var videoId = Guid.NewGuid();
        return Task.FromResult(new VideoUploadResponse { VideoId = videoId, UploadUrl = $"/uploads/{videoId}" });
    }

    public async Task<VideoDto> CompleteUploadAsync(Guid videoId, string videoUrl, string? thumbnailUrl, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>().FindAsync(new object[] { videoId }, ct);
        if (video == null) throw new Exception("Video not found");
        
        video.VideoUrl = videoUrl;
        video.ThumbnailUrl = thumbnailUrl;
        video.IsProcessed = true;
        await _context.SaveChangesAsync(ct);
        
        return MapToDto(video);
    }

    public async Task<VideoDto> UpdateAsync(Guid id, UpdateVideoRequest request, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>().FindAsync(new object[] { id }, ct);
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

    public async Task RecordViewAsync(Guid videoId, Guid? userId, string? sessionId, string? ipAddress, CancellationToken ct = default)
    {
        var video = await _context.Set<Video>().FindAsync(new object[] { videoId }, ct);
        if (video != null)
        {
            video.ViewCount++;
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task UpdateWatchProgressAsync(Guid videoId, Guid? userId, TimeSpan watchDuration, double watchPercent, CancellationToken ct = default)
    {
        // Could store watch progress for users - simplified for now
        await Task.CompletedTask;
    }

    private static VideoDto MapToDto(Video v) => new()
    {
        Id = v.Id,
        ChannelId = v.ChannelId,
        Title = v.Title,
        Description = v.Description,
        Slug = v.Slug,
        VideoUrl = v.VideoUrl,
        ThumbnailUrl = v.ThumbnailUrl,
        Duration = v.Duration,
        ViewCount = v.ViewCount,
        LikeCount = v.LikeCount,
        CommentCount = v.CommentCount,
        Type = v.Type.ToString(),
        Status = v.Status.ToString(),
        PublishedAt = v.PublishedAt,
        CreatedAt = v.CreatedAt
    };
}
