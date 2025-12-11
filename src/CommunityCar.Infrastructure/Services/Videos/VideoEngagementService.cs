using CommunityCar.Application.Common.Interfaces.Videos;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Videos;
using CommunityCar.Application.DTOs.Response.Videos;
using CommunityCar.Domain.Entities.Videos.Common;
using CommunityCar.Domain.Entities.Videos.Engagement;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using static CommunityCar.Domain.Entities.Videos.Engagement.VideoShare;

namespace CommunityCar.Infrastructure.Services.Videos;

public class VideoEngagementService : IVideoEngagementService
{
    private readonly AppDbContext _context;

    public VideoEngagementService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ReactionDto> ReactAsync(Guid videoId, Guid userId, ReactionType type, CancellationToken ct = default)
    {
        var existing = await _context.VideoReactions
            .FirstOrDefaultAsync(r => r.VideoId == videoId && r.UserId == userId, ct);

        if (existing != null)
        {
            existing.Type = type;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            existing = new VideoReaction
            {
                Id = Guid.NewGuid(),
                VideoId = videoId,
                UserId = userId,
                Type = type,
                CreatedAt = DateTime.UtcNow
            };
            _context.VideoReactions.Add(existing);
            
            var video = await _context.Videos.FindAsync(new object[] { videoId }, ct);
            if (video != null && type == ReactionType.Like)
                video.LikeCount++;
        }

        await _context.SaveChangesAsync(ct);
        return new ReactionDto(existing.Id, existing.Type);
    }

    public async Task RemoveReactionAsync(Guid videoId, Guid userId, CancellationToken ct = default)
    {
        var reaction = await _context.VideoReactions
            .FirstOrDefaultAsync(r => r.VideoId == videoId && r.UserId == userId, ct);

        if (reaction != null)
        {
            var video = await _context.Videos.FindAsync(new object[] { videoId }, ct);
            if (video != null && reaction.Type == ReactionType.Like)
                video.LikeCount = Math.Max(0, video.LikeCount - 1);
            
            _context.VideoReactions.Remove(reaction);
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task<PagedResult<CommentDto>> GetCommentsAsync(Guid videoId, CommentSearchRequest request, CancellationToken ct = default)
    {
        var query = _context.VideoComments
            .Include(c => c.Author)
            .Where(c => c.VideoId == videoId && !c.IsDeleted && c.ParentCommentId == null);

        query = request.SortBy switch
        {
            "New" => query.OrderByDescending(c => c.CreatedAt),
            _ => query.OrderByDescending(c => c.LikeCount).ThenByDescending(c => c.CreatedAt)
        };

        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(c => MapToCommentDto(c))
            .ToListAsync(ct);

        return new PagedResult<CommentDto>(items, total, request.Page, request.PageSize);
    }

    public async Task<CommentDto> CreateCommentAsync(Guid userId, CreateCommentRequest request, CancellationToken ct = default)
    {
        var user = await _context.Users.FindAsync(new object[] { userId }, ct);
        var video = await _context.Videos.Include(v => v.Channel).FirstOrDefaultAsync(v => v.Id == request.VideoId, ct);
        
        var comment = new VideoComment
        {
            Id = Guid.NewGuid(),
            VideoId = request.VideoId,
            AuthorId = userId,
            Content = request.Content,
            ParentCommentId = request.ParentId,
            CreatedAt = DateTime.UtcNow
        };

        _context.VideoComments.Add(comment);
        
        if (video != null)
            video.CommentCount++;

        await _context.SaveChangesAsync(ct);

        return new CommentDto(
            comment.Id,
            comment.VideoId,
            comment.AuthorId,
            user?.UserName ?? "User",
            user?.AvatarUrl,
            comment.Content,
            comment.ParentCommentId,
            0, 0, false, false,
            video?.Channel?.UserId == userId,
            null,
            comment.CreatedAt
        );
    }

    public async Task<CommentDto> UpdateCommentAsync(Guid commentId, string content, CancellationToken ct = default)
    {
        var comment = await _context.VideoComments
            .Include(c => c.Author)
            .FirstOrDefaultAsync(c => c.Id == commentId, ct);
        
        if (comment == null) throw new Exception("Comment not found");

        comment.Content = content;
        comment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return MapToCommentDto(comment);
    }

    public async Task DeleteCommentAsync(Guid commentId, CancellationToken ct = default)
    {
        var comment = await _context.VideoComments.FindAsync(new object[] { commentId }, ct);
        if (comment != null)
        {
            comment.IsDeleted = true;
            var video = await _context.Videos.FindAsync(new object[] { comment.VideoId }, ct);
            if (video != null)
                video.CommentCount = Math.Max(0, video.CommentCount - 1);
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task LikeCommentAsync(Guid commentId, Guid userId, CancellationToken ct = default)
    {
        var comment = await _context.VideoComments.FindAsync(new object[] { commentId }, ct);
        if (comment != null)
        {
            comment.LikeCount++;
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task UnlikeCommentAsync(Guid commentId, Guid userId, CancellationToken ct = default)
    {
        var comment = await _context.VideoComments.FindAsync(new object[] { commentId }, ct);
        if (comment != null)
        {
            comment.LikeCount = Math.Max(0, comment.LikeCount - 1);
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task PinCommentAsync(Guid commentId, Guid userId, CancellationToken ct = default)
    {
        var comment = await _context.VideoComments.FindAsync(new object[] { commentId }, ct);
        if (comment != null)
        {
            comment.IsPinned = !comment.IsPinned;
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task<SavedVideoDto> SaveVideoAsync(Guid userId, AddToCollectionRequest request, CancellationToken ct = default)
    {
        var saved = new SavedVideo
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            VideoId = request.VideoId,
            CollectionId = request.CollectionId,
            CreatedAt = DateTime.UtcNow
        };

        _context.SavedVideos.Add(saved);
        
        var video = await _context.Videos.FindAsync(new object[] { request.VideoId }, ct);
        if (video != null)
            video.SaveCount++;

        await _context.SaveChangesAsync(ct);

        var videoData = await _context.Videos.FindAsync(new object[] { request.VideoId }, ct);
        return new SavedVideoDto(
            saved.Id,
            saved.VideoId,
            videoData != null ? new VideoSummaryDto(videoData.Id, videoData.Title, videoData.ThumbnailUrl, videoData.Duration, "", videoData.ViewCount) : null!,
            saved.CollectionId,
            saved.CreatedAt
        );
    }

    public async Task UnsaveVideoAsync(Guid userId, Guid videoId, CancellationToken ct = default)
    {
        var saved = await _context.SavedVideos
            .FirstOrDefaultAsync(s => s.UserId == userId && s.VideoId == videoId, ct);
        
        if (saved != null)
        {
            _context.SavedVideos.Remove(saved);
            var video = await _context.Videos.FindAsync(new object[] { videoId }, ct);
            if (video != null)
                video.SaveCount = Math.Max(0, video.SaveCount - 1);
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task<PagedResult<SavedVideoDto>> GetSavedVideosAsync(Guid userId, Guid? collectionId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.SavedVideos
            .Include(s => s.Video)
            .Where(s => s.UserId == userId);

        if (collectionId.HasValue)
            query = query.Where(s => s.CollectionId == collectionId);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new SavedVideoDto(
                s.Id,
                s.VideoId,
                new VideoSummaryDto(s.Video.Id, s.Video.Title, s.Video.ThumbnailUrl, s.Video.Duration, "", s.Video.ViewCount),
                s.CollectionId,
                s.CreatedAt
            ))
            .ToListAsync(ct);

        return new PagedResult<SavedVideoDto>(items, total, page, pageSize);
    }

    public Task<List<VideoCollectionDto>> GetUserCollectionsAsync(Guid userId, CancellationToken ct = default)
    {
        return Task.FromResult(new List<VideoCollectionDto>
        {
            new(Guid.NewGuid(), "Watch Later", "Videos to watch later", false, 0, null, DateTime.UtcNow),
            new(Guid.NewGuid(), "Favorites", "My favorite videos", false, 0, null, DateTime.UtcNow)
        });
    }

    public Task<VideoCollectionDto> CreateCollectionAsync(Guid userId, CreateCollectionRequest request, CancellationToken ct = default)
    {
        return Task.FromResult(new VideoCollectionDto(
            Guid.NewGuid(),
            request.Name,
            request.Description,
            request.IsPrivate,
            0,
            null,
            DateTime.UtcNow
        ));
    }

    public Task<VideoCollectionDto> UpdateCollectionAsync(Guid collectionId, CreateCollectionRequest request, CancellationToken ct = default)
    {
        return Task.FromResult(new VideoCollectionDto(
            collectionId,
            request.Name,
            request.Description,
            request.IsPrivate,
            0,
            null,
            DateTime.UtcNow
        ));
    }

    public Task DeleteCollectionAsync(Guid collectionId, CancellationToken ct = default)
    {
        return Task.CompletedTask;
    }

    public async Task<ShareResponseDto> RecordShareAsync(Guid videoId, Guid? userId, string platform, CancellationToken ct = default)
    {
        var sharePlatform = platform.ToLower() switch
        {
            "whatsapp" => SharePlatform.WhatsApp,
            "facebook" => SharePlatform.Facebook,
            "twitter" => SharePlatform.Twitter,
            "instagram" => SharePlatform.Instagram,
            "tiktok" => SharePlatform.TikTok,
            "email" => SharePlatform.Email,
            "copy" or "copylink" => SharePlatform.CopyLink,
            _ => SharePlatform.Other
        };

        var share = new VideoShare
        {
            Id = Guid.NewGuid(),
            VideoId = videoId,
            UserId = userId,
            Platform = sharePlatform,
            CreatedAt = DateTime.UtcNow
        };

        _context.VideoShares.Add(share);
        
        var video = await _context.Videos.FindAsync(new object[] { videoId }, ct);
        if (video != null)
            video.ShareCount++;

        await _context.SaveChangesAsync(ct);

        return new ShareResponseDto($"https://communitycar.com/videos/{videoId}");
    }

    private static CommentDto MapToCommentDto(VideoComment c) => new(
        c.Id,
        c.VideoId,
        c.AuthorId,
        c.Author?.UserName ?? "User",
        c.Author?.AvatarUrl,
        c.Content,
        c.ParentCommentId,
        c.LikeCount,
        c.ReplyCount,
        c.IsPinned,
        false,
        c.IsCreatorReplied,
        null,
        c.CreatedAt
    );
}
