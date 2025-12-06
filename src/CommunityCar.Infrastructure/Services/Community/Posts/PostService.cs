using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.Posts;
using CommunityCar.Application.DTOs.Response.Community.Posts;

namespace CommunityCar.Infrastructure.Services.Community.Posts;

/// <summary>
/// Main service for managing community posts - delegates to focused services
/// </summary>
public class PostService : IPostService
{
    private readonly PostQueryService _queryService;
    private readonly PostCommandService _commandService;
    private readonly PostEngagementService _engagementService;
    private readonly PostCommentService _commentService;
    private readonly PostCategoryService _categoryService;

    public PostService(
        PostQueryService queryService,
        PostCommandService commandService,
        PostEngagementService engagementService,
        PostCommentService commentService,
        PostCategoryService categoryService)
    {
        _queryService = queryService;
        _commandService = commandService;
        _engagementService = engagementService;
        _commentService = commentService;
        _categoryService = categoryService;
    }

    #region Query Operations

    public Task<PostDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
        => _queryService.GetByIdAsync(id, currentUserId);

    public Task<PostDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
        => _queryService.GetBySlugAsync(slug, currentUserId);

    public Task<PagedResult<PostListDto>> GetPostsAsync(
        PostFilter filter,
        int page = 1,
        int pageSize = 20)
        => _queryService.GetPostsAsync(filter, page, pageSize);

    public Task<PagedResult<PostListDto>> GetUserPostsAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
        => _queryService.GetUserPostsAsync(userId, page, pageSize);

    public Task<PagedResult<PostListDto>> GetGroupPostsAsync(
        Guid groupId,
        int page = 1,
        int pageSize = 20)
        => _queryService.GetGroupPostsAsync(groupId, page, pageSize);

    public Task<IEnumerable<PostListDto>> GetFeedAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
        => _queryService.GetFeedAsync(userId, page, pageSize);

    #endregion

    #region Command Operations

    public Task<PostDto> CreateAsync(Guid authorId, CreatePostRequest request)
        => _commandService.CreateAsync(authorId, request);

    public Task<PostDto> UpdateAsync(Guid postId, Guid userId, UpdatePostRequest request)
        => _commandService.UpdateAsync(postId, userId, request);

    public Task<bool> DeleteAsync(Guid postId, Guid userId)
        => _commandService.DeleteAsync(postId, userId);

    public Task<bool> PublishAsync(Guid postId, Guid userId)
        => _commandService.PublishAsync(postId, userId);

    #endregion

    #region Engagement Operations

    public Task<bool> LikeAsync(Guid postId, Guid userId)
        => _engagementService.LikeAsync(postId, userId);

    public Task<bool> UnlikeAsync(Guid postId, Guid userId)
        => _engagementService.UnlikeAsync(postId, userId);

    public Task IncrementViewAsync(Guid postId)
        => _engagementService.IncrementViewAsync(postId);

    #endregion

    #region Comment Operations

    public Task<PagedResult<PostCommentDto>> GetCommentsAsync(
        Guid postId,
        int page = 1,
        int pageSize = 20)
        => _commentService.GetCommentsAsync(postId, page, pageSize);

    public Task<PostCommentDto> AddCommentAsync(
        Guid postId,
        Guid userId,
        CreateCommentRequest request)
        => _commentService.AddCommentAsync(postId, userId, request);

    public Task<bool> DeleteCommentAsync(Guid commentId, Guid userId)
        => _commentService.DeleteCommentAsync(commentId, userId);

    public Task<bool> LikeCommentAsync(Guid commentId, Guid userId)
        => _commentService.LikeCommentAsync(commentId, userId);

    #endregion

    #region Category Operations

    public Task<IEnumerable<PostCategoryDto>> GetCategoriesAsync()
        => _categoryService.GetCategoriesAsync();

    #endregion
}
