using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.Posts;
using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community.Posts;

/// <summary>
/// Service for managing community posts
/// </summary>
public class PostService : IPostService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Post> _postRepository;
    private readonly IRepository<PostLike> _postLikeRepository;
    private readonly IRepository<PostComment> _commentRepository;
    private readonly IRepository<PostCategory> _categoryRepository;
    private readonly IReadOnlyRepository<ApplicationUser> _userRepository;

    public PostService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _postRepository = unitOfWork.Repository<Post>();
        _postLikeRepository = unitOfWork.Repository<PostLike>();
        _commentRepository = unitOfWork.Repository<PostComment>();
        _categoryRepository = unitOfWork.Repository<PostCategory>();
        _userRepository = new ReadOnlyRepository<ApplicationUser>(
            (unitOfWork as UnitOfWork)?.GetContext() ?? throw new InvalidOperationException());
    }

    #region Query Operations

    public async Task<PostDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var post = await _postRepository
            .GetWithIncludesAsync(
                p => p.Id == id,
                p => p.Author,
                p => p.Category,
                p => p.Media,
                p => p.Tags
            );

        if (!post.Any()) return null;

        var postEntity = post.First();
        var isLiked = currentUserId.HasValue &&
            await _postLikeRepository.AnyAsync(l => l.PostId == id && l.UserId == currentUserId.Value);

        return MapToDto(postEntity, isLiked);
    }

    public async Task<PostDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        var post = await _postRepository
            .GetWithIncludesAsync(
                p => p.Slug == slug,
                p => p.Author,
                p => p.Category,
                p => p.Media
            );

        if (!post.Any()) return null;

        var postEntity = post.First();
        var isLiked = currentUserId.HasValue &&
            await _postLikeRepository.AnyAsync(l => l.PostId == postEntity.Id && l.UserId == currentUserId.Value);

        return MapToDto(postEntity, isLiked);
    }

    public async Task<PagedResult<PostListDto>> GetPostsAsync(
        PostFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _postRepository.AsQueryable()
            .Include(p => p.Author)
            .Include(p => p.Media)
            .Where(p => p.Status == PostStatus.Published);

        if (filter.Type.HasValue)
            query = query.Where(p => p.Type == filter.Type.Value);

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId.Value);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(p =>
                p.Title.Contains(filter.SearchTerm) ||
                p.Content.Contains(filter.SearchTerm));

        if (filter.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == filter.IsFeatured.Value);

        query = filter.SortBy switch
        {
            "popular" => query.OrderByDescending(p => p.LikeCount),
            "comments" => query.OrderByDescending(p => p.CommentCount),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<PostListDto>(
            items.Select(p => MapToListDto(p, false)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PagedResult<PostListDto>> GetUserPostsAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var (items, totalCount) = await _postRepository.GetPagedAsync(
            page,
            pageSize,
            p => p.AuthorId == userId && p.Status == PostStatus.Published,
            p => p.CreatedAt,
            ascending: false
        );

        return new PagedResult<PostListDto>(
            items.Select(p => MapToListDto(p, false)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PagedResult<PostListDto>> GetGroupPostsAsync(
        Guid groupId,
        int page = 1,
        int pageSize = 20)
    {
        var (items, totalCount) = await _postRepository.GetPagedAsync(
            page,
            pageSize,
            p => p.GroupId == groupId && p.Status == PostStatus.Published,
            p => p.CreatedAt,
            ascending: false
        );

        return new PagedResult<PostListDto>(
            items.Select(p => MapToListDto(p, false)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<IEnumerable<PostListDto>> GetFeedAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var posts = await _postRepository
            .GetWithIncludesAsync(
                p => p.Status == PostStatus.Published && p.Visibility == PostVisibility.Public,
                p => p.Author,
                p => p.Media
            );

        var orderedPosts = posts
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var postIds = orderedPosts.Select(p => p.Id).ToList();
        var likedPostIds = (await _postLikeRepository
            .GetAsync(l => l.UserId == userId && postIds.Contains(l.PostId)))
            .Select(l => l.PostId)
            .ToList();

        return orderedPosts.Select(p => MapToListDto(p, likedPostIds.Contains(p.Id)));
    }

    #endregion

    #region Command Operations

    public async Task<PostDto> CreateAsync(Guid authorId, CreatePostRequest request)
    {
        var post = new Post
        {
            AuthorId = authorId,
            Title = request.Title,
            Content = request.Content,
            Type = request.Type,
            Visibility = Enum.Parse<PostVisibility>(request.Visibility),
            CategoryId = request.CategoryId,
            GroupId = request.GroupId,
            Status = PostStatus.Published,
            PublishedAt = DateTime.UtcNow,
            Slug = GenerateSlug(request.Title)
        };

        if (request.MediaUrls?.Any() == true)
        {
            post.Media = request.MediaUrls.Select(url => new PostMedia
            {
                Url = url,
                Type = url.Contains("video") ? MediaType.Video : MediaType.Image
            }).ToList();
        }

        await _postRepository.AddAsync(post);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(post.Id, authorId))!;
    }

    public async Task<PostDto> UpdateAsync(Guid postId, Guid userId, UpdatePostRequest request)
    {
        var post = await _postRepository.FirstOrDefaultAsync(
            p => p.Id == postId && p.AuthorId == userId)
            ?? throw new InvalidOperationException("Post not found or unauthorized");

        if (request.Title != null) post.Title = request.Title;
        if (request.Content != null) post.Content = request.Content;
        if (request.Type.HasValue) post.Type = request.Type.Value;
        if (request.Visibility != null) post.Visibility = Enum.Parse<PostVisibility>(request.Visibility);
        if (request.CategoryId.HasValue) post.CategoryId = request.CategoryId;

        _postRepository.Update(post);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(postId, userId))!;
    }

    public async Task<bool> DeleteAsync(Guid postId, Guid userId)
    {
        var post = await _postRepository.FirstOrDefaultAsync(
            p => p.Id == postId && p.AuthorId == userId);

        if (post == null) return false;

        _postRepository.Delete(post);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> PublishAsync(Guid postId, Guid userId)
    {
        var post = await _postRepository.FirstOrDefaultAsync(
            p => p.Id == postId && p.AuthorId == userId);

        if (post == null) return false;

        post.Status = PostStatus.Published;
        post.PublishedAt = DateTime.UtcNow;

        _postRepository.Update(post);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Engagement Operations

    public async Task<bool> LikeAsync(Guid postId, Guid userId)
    {
        var exists = await _postLikeRepository.AnyAsync(
            l => l.PostId == postId && l.UserId == userId);

        if (exists) return false;

        await _postLikeRepository.AddAsync(new PostLike
        {
            PostId = postId,
            UserId = userId
        });

        var post = await _postRepository.GetByIdAsync(postId);
        if (post != null)
        {
            post.LikeCount++;
            _postRepository.Update(post);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnlikeAsync(Guid postId, Guid userId)
    {
        var like = await _postLikeRepository.FirstOrDefaultAsync(
            l => l.PostId == postId && l.UserId == userId);

        if (like == null) return false;

        _postLikeRepository.Delete(like);

        var post = await _postRepository.GetByIdAsync(postId);
        if (post != null && post.LikeCount > 0)
        {
            post.LikeCount--;
            _postRepository.Update(post);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task IncrementViewAsync(Guid postId)
    {
        var post = await _postRepository.GetByIdAsync(postId);
        if (post != null)
        {
            post.ViewCount++;
            _postRepository.Update(post);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    #endregion

    #region Comment Operations

    public async Task<PagedResult<PostCommentDto>> GetCommentsAsync(
        Guid postId,
        int page = 1,
        int pageSize = 20)
    {
        var (items, totalCount) = await _commentRepository.GetPagedAsync(
            page,
            pageSize,
            c => c.PostId == postId && c.ParentId == null,
            c => c.CreatedAt,
            ascending: false
        );

        var comments = await _commentRepository
            .GetWithIncludesAsync(
                c => items.Select(i => i.Id).Contains(c.Id),
                c => c.Author
            );

        return new PagedResult<PostCommentDto>(
            comments.Select(MapCommentToDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PostCommentDto> AddCommentAsync(
        Guid postId,
        Guid userId,
        CreateCommentRequest request)
    {
        var comment = new PostComment
        {
            PostId = postId,
            AuthorId = userId,
            Content = request.Content,
            ParentId = request.ParentId
        };

        await _commentRepository.AddAsync(comment);

        var post = await _postRepository.GetByIdAsync(postId);
        if (post != null)
        {
            post.CommentCount++;
            _postRepository.Update(post);
        }

        await _unitOfWork.SaveChangesAsync();

        var saved = await _commentRepository
            .GetWithIncludesAsync(
                c => c.Id == comment.Id,
                c => c.Author
            );

        return MapCommentToDto(saved.First());
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, Guid userId)
    {
        var comment = await _commentRepository.FirstOrDefaultAsync(
            c => c.Id == commentId && c.AuthorId == userId);

        if (comment == null) return false;

        var post = await _postRepository.GetByIdAsync(comment.PostId);
        if (post != null && post.CommentCount > 0)
        {
            post.CommentCount--;
            _postRepository.Update(post);
        }

        _commentRepository.Delete(comment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> LikeCommentAsync(Guid commentId, Guid userId)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment == null) return false;

        comment.LikeCount++;
        _commentRepository.Update(comment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Category Operations

    public async Task<IEnumerable<PostCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(c => new PostCategoryDto(
            c.Id,
            c.Name,
            c.Slug,
            c.Icon
        ));
    }

    #endregion

    #region Private Helper Methods

    private static string GenerateSlug(string title)
    {
        return title.ToLower()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "")
            + "-" + Guid.NewGuid().ToString()[..8];
    }

    private static PostDto MapToDto(Post p, bool isLiked) => new(
        p.Id,
        p.AuthorId,
        new PostAuthorDto(
            p.Author.Id,
            p.Author.FirstName ?? "",
            p.Author.LastName ?? "",
            p.Author.AvatarUrl,
            p.Author.UserType.ToString()
        ),
        p.Title,
        p.Content,
        p.Slug,
        p.Type,
        p.Status.ToString(),
        p.Visibility.ToString(),
        p.CoverImageUrl,
        p.Media.Select(m => new PostMediaDto(
            m.Id,
            m.Url,
            m.Type.ToString(),
            m.ThumbnailUrl
        )).ToList(),
        p.CategoryId,
        p.Category != null
            ? new PostCategoryDto(
                p.Category.Id,
                p.Category.Name,
                p.Category.Slug,
                p.Category.Icon
            )
            : null,
        p.Tags.Select(t => t.Name).ToList(),
        p.GroupId,
        p.ViewCount,
        p.LikeCount,
        p.CommentCount,
        p.ShareCount,
        p.AllowComments,
        p.IsPinned,
        p.IsFeatured,
        isLiked,
        p.PublishedAt,
        p.CreatedAt
    );

    private static PostListDto MapToListDto(Post p, bool isLiked) => new(
        p.Id,
        p.AuthorId,
        new PostAuthorDto(
            p.Author.Id,
            p.Author.FirstName ?? "",
            p.Author.LastName ?? "",
            p.Author.AvatarUrl,
            p.Author.UserType.ToString()
        ),
        p.Title,
        p.Content,
        p.Slug,
        p.Type,
        p.CoverImageUrl,
        p.Media.Select(m => new PostMediaDto(
            m.Id,
            m.Url,
            m.Type.ToString(),
            m.ThumbnailUrl
        )).ToList(),
        p.LikeCount,
        p.CommentCount,
        p.ShareCount,
        isLiked,
        p.PublishedAt,
        p.CreatedAt
    );

    private static PostCommentDto MapCommentToDto(PostComment c) => new(
        c.Id,
        c.PostId,
        c.AuthorId,
        new PostAuthorDto(
            c.Author.Id,
            c.Author.FirstName ?? "",
            c.Author.LastName ?? "",
            c.Author.AvatarUrl,
            c.Author.UserType.ToString()
        ),
        c.Content,
        c.LikeCount,
        false,
        c.ParentId,
        null,
        c.CreatedAt
    );

    #endregion
}
