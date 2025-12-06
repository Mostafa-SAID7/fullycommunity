using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Application.DTOs.Requests.Community.Posts;
using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IPostService
{
    // Posts
    Task<PostDto?> GetByIdAsync(Guid id, Guid? currentUserId = null);
    Task<PostDto?> GetBySlugAsync(string slug, Guid? currentUserId = null);
    Task<PagedResult<PostListDto>> GetPostsAsync(PostFilter filter, int page = 1, int pageSize = 20);
    Task<PagedResult<PostListDto>> GetUserPostsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<PagedResult<PostListDto>> GetGroupPostsAsync(Guid groupId, int page = 1, int pageSize = 20);
    Task<IEnumerable<PostListDto>> GetFeedAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<PostDto> CreateAsync(Guid authorId, CreatePostRequest request);
    Task<PostDto> UpdateAsync(Guid postId, Guid userId, UpdatePostRequest request);
    Task<bool> DeleteAsync(Guid postId, Guid userId);
    Task<bool> PublishAsync(Guid postId, Guid userId);
    
    // Engagement
    Task<bool> LikeAsync(Guid postId, Guid userId);
    Task<bool> UnlikeAsync(Guid postId, Guid userId);
    Task IncrementViewAsync(Guid postId);
    
    // Comments
    Task<PagedResult<PostCommentDto>> GetCommentsAsync(Guid postId, int page = 1, int pageSize = 20);
    Task<PostCommentDto> AddCommentAsync(Guid postId, Guid userId, CreateCommentRequest request);
    Task<bool> DeleteCommentAsync(Guid commentId, Guid userId);
    Task<bool> LikeCommentAsync(Guid commentId, Guid userId);
    
    // Categories
    Task<IEnumerable<PostCategoryDto>> GetCategoriesAsync();
}

public record PostFilter(
    PostType? Type = null,
    Guid? CategoryId = null,
    PostVisibility? Visibility = null,
    string? SearchTerm = null,
    string? Tag = null,
    bool? IsFeatured = null,
    string? SortBy = null
);
