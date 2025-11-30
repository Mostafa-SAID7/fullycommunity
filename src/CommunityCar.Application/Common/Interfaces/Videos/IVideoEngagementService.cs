using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.Engagement;
using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Application.Common.Interfaces.Videos;

public interface IVideoEngagementService
{
    // Reactions
    Task<VideoReactionDto> ReactAsync(Guid videoId, Guid userId, ReactionType type, CancellationToken ct = default);
    Task RemoveReactionAsync(Guid videoId, Guid userId, CancellationToken ct = default);
    Task<ReactionType?> GetUserReactionAsync(Guid videoId, Guid userId, CancellationToken ct = default);
    
    // Comments
    Task<VideoCommentDto?> GetCommentByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<VideoCommentDto>> GetCommentsAsync(Guid videoId, CommentSearchRequest request, CancellationToken ct = default);
    Task<VideoCommentDto> CreateCommentAsync(Guid userId, CreateCommentRequest request, CancellationToken ct = default);
    Task<VideoCommentDto> UpdateCommentAsync(Guid id, string content, CancellationToken ct = default);
    Task DeleteCommentAsync(Guid id, CancellationToken ct = default);
    Task LikeCommentAsync(Guid commentId, Guid userId, CancellationToken ct = default);
    Task UnlikeCommentAsync(Guid commentId, Guid userId, CancellationToken ct = default);
    Task PinCommentAsync(Guid commentId, Guid channelOwnerId, CancellationToken ct = default);
    
    // Saved Videos
    Task<SavedVideoDto> SaveVideoAsync(Guid userId, AddToCollectionRequest request, CancellationToken ct = default);
    Task UnsaveVideoAsync(Guid userId, Guid videoId, CancellationToken ct = default);
    Task<bool> IsVideoSavedAsync(Guid userId, Guid videoId, CancellationToken ct = default);
    Task<PagedResult<SavedVideoDto>> GetSavedVideosAsync(Guid userId, Guid? collectionId, int page, int pageSize, CancellationToken ct = default);
    
    // Collections
    Task<VideoCollectionDto> CreateCollectionAsync(Guid userId, CreateCollectionRequest request, CancellationToken ct = default);
    Task<VideoCollectionDto> UpdateCollectionAsync(Guid id, CreateCollectionRequest request, CancellationToken ct = default);
    Task DeleteCollectionAsync(Guid id, CancellationToken ct = default);
    Task<List<VideoCollectionDto>> GetUserCollectionsAsync(Guid userId, CancellationToken ct = default);
    
    // Shares
    Task<VideoShareDto> RecordShareAsync(Guid videoId, Guid? userId, string platform, CancellationToken ct = default);
}
