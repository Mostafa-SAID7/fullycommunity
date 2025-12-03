using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Videos.Engagement;
using CommunityCar.Application.Features.Videos.DTOs;
using CommunityCar.Domain.Entities.Videos.Common;

namespace CommunityCar.Application.Common.Interfaces.Videos;

public interface IVideoEngagementService
{
    // Reactions
    Task<ReactionDto> ReactAsync(Guid videoId, Guid userId, ReactionType type, CancellationToken ct = default);
    Task RemoveReactionAsync(Guid videoId, Guid userId, CancellationToken ct = default);
    
    // Comments
    Task<PagedResult<CommentDto>> GetCommentsAsync(Guid videoId, CommentSearchRequest request, CancellationToken ct = default);
    Task<CommentDto> CreateCommentAsync(Guid userId, CreateCommentRequest request, CancellationToken ct = default);
    Task<CommentDto> UpdateCommentAsync(Guid commentId, string content, CancellationToken ct = default);
    Task DeleteCommentAsync(Guid commentId, CancellationToken ct = default);
    Task LikeCommentAsync(Guid commentId, Guid userId, CancellationToken ct = default);
    Task UnlikeCommentAsync(Guid commentId, Guid userId, CancellationToken ct = default);
    Task PinCommentAsync(Guid commentId, Guid userId, CancellationToken ct = default);
    
    // Saved Videos
    Task<SavedVideoDto> SaveVideoAsync(Guid userId, AddToCollectionRequest request, CancellationToken ct = default);
    Task UnsaveVideoAsync(Guid userId, Guid videoId, CancellationToken ct = default);
    Task<PagedResult<SavedVideoDto>> GetSavedVideosAsync(Guid userId, Guid? collectionId, int page, int pageSize, CancellationToken ct = default);
    
    // Collections
    Task<List<VideoCollectionDto>> GetUserCollectionsAsync(Guid userId, CancellationToken ct = default);
    Task<VideoCollectionDto> CreateCollectionAsync(Guid userId, CreateCollectionRequest request, CancellationToken ct = default);
    Task<VideoCollectionDto> UpdateCollectionAsync(Guid collectionId, CreateCollectionRequest request, CancellationToken ct = default);
    Task DeleteCollectionAsync(Guid collectionId, CancellationToken ct = default);
    
    // Shares
    Task<ShareResponseDto> RecordShareAsync(Guid videoId, Guid? userId, string platform, CancellationToken ct = default);
}
