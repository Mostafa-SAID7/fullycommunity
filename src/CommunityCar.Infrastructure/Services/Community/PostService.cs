using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Application.DTOs.Requests.Community.Posts;
using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community;

public class PostService : IPostService
{
    private readonly AppDbContext _context;

    public PostService(AppDbContext context) => _context = context;

    public async Task<PostDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var post = await _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Category)
            .Include(p => p.Media)
            .Include(p => p.Tags)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null) return null;

        var isLiked = currentUserId.HasValue &&
            await _context.Set<PostLike>().AnyAsync(l => l.PostId == id && l.UserId == currentUserId);

        return MapToDto(post, isLiked);
    }

    public async Task<PostDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        var post = await _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Category)
            .Include(p => p.Media)
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (post == null) return null;

        var isLiked = currentUserId.HasValue &&
            await _context.Set<PostLike>().AnyAsync(l => l.PostId == post.Id && l.UserId == currentUserId);

        return MapToDto(post, isLiked);
    }

    public async Task<PagedResult<PostListDto>> GetPostsAsync(PostFilter filter, int page = 1, int pageSize = 20)
    {
        var query = _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Media)
            .Where(p => p.Status == PostStatus.Published)
            .AsQueryable();

        if (filter.Type.HasValue)
            query = query.Where(p => p.Type == filter.Type.Value);

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId.Value);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(p => p.Title.Contains(filter.SearchTerm) || p.Content.Contains(filter.SearchTerm));

        if (filter.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == filter.IsFeatured.Value);

        query = filter.SortBy switch
        {
            "popular" => query.OrderByDescending(p => p.LikeCount),
            "comments" => query.OrderByDescending(p => p.CommentCount),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<PostListDto>(
            items.Select(p => MapToListDto(p, false)).ToList(),
            totalCount, page, pageSize
        );
    }

    public async Task<PagedResult<PostListDto>> GetUserPostsAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        var query = _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Media)
            .Where(p => p.AuthorId == userId && p.Status == PostStatus.Published)
            .OrderByDescending(p => p.CreatedAt);

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<PostListDto>(
            items.Select(p => MapToListDto(p, false)).ToList(),
            totalCount, page, pageSize
        );
    }

    public async Task<PagedResult<PostListDto>> GetGroupPostsAsync(Guid groupId, int page = 1, int pageSize = 20)
    {
        var query = _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Media)
            .Where(p => p.GroupId == groupId && p.Status == PostStatus.Published)
            .OrderByDescending(p => p.CreatedAt);

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<PostListDto>(
            items.Select(p => MapToListDto(p, false)).ToList(),
            totalCount, page, pageSize
        );
    }

    public async Task<IEnumerable<PostListDto>> GetFeedAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        var posts = await _context.Posts
            .Include(p => p.Author)
            .Include(p => p.Media)
            .Where(p => p.Status == PostStatus.Published && p.Visibility == PostVisibility.Public)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var postIds = posts.Select(p => p.Id).ToList();
        var likedPostIds = await _context.Set<PostLike>()
            .Where(l => l.UserId == userId && postIds.Contains(l.PostId))
            .Select(l => l.PostId)
            .ToListAsync();

        return posts.Select(p => MapToListDto(p, likedPostIds.Contains(p.Id)));
    }

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

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        return (await GetByIdAsync(post.Id, authorId))!;
    }

    public async Task<PostDto> UpdateAsync(Guid postId, Guid userId, UpdatePostRequest request)
    {
        var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == postId && p.AuthorId == userId)
            ?? throw new InvalidOperationException("Post not found or unauthorized");

        if (request.Title != null) post.Title = request.Title;
        if (request.Content != null) post.Content = request.Content;
        if (request.Type.HasValue) post.Type = request.Type.Value;
        if (request.Visibility != null) post.Visibility = Enum.Parse<PostVisibility>(request.Visibility);
        if (request.CategoryId.HasValue) post.CategoryId = request.CategoryId;

        await _context.SaveChangesAsync();
        return (await GetByIdAsync(postId, userId))!;
    }

    public async Task<bool> DeleteAsync(Guid postId, Guid userId)
    {
        var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == postId && p.AuthorId == userId);
        if (post == null) return false;

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> PublishAsync(Guid postId, Guid userId)
    {
        var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == postId && p.AuthorId == userId);
        if (post == null) return false;

        post.Status = PostStatus.Published;
        post.PublishedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }


    public async Task<bool> LikeAsync(Guid postId, Guid userId)
    {
        var exists = await _context.Set<PostLike>().AnyAsync(l => l.PostId == postId && l.UserId == userId);
        if (exists) return false;

        _context.Set<PostLike>().Add(new PostLike { PostId = postId, UserId = userId });

        var post = await _context.Posts.FindAsync(postId);
        if (post != null) post.LikeCount++;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnlikeAsync(Guid postId, Guid userId)
    {
        var like = await _context.Set<PostLike>().FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);
        if (like == null) return false;

        _context.Set<PostLike>().Remove(like);

        var post = await _context.Posts.FindAsync(postId);
        if (post != null && post.LikeCount > 0) post.LikeCount--;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task IncrementViewAsync(Guid postId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post != null)
        {
            post.ViewCount++;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<PagedResult<PostCommentDto>> GetCommentsAsync(Guid postId, int page = 1, int pageSize = 20)
    {
        var query = _context.PostComments
            .Include(c => c.Author)
            .Where(c => c.PostId == postId && c.ParentId == null)
            .OrderByDescending(c => c.CreatedAt);

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<PostCommentDto>(
            items.Select(MapCommentToDto).ToList(),
            totalCount, page, pageSize
        );
    }

    public async Task<PostCommentDto> AddCommentAsync(Guid postId, Guid userId, CreateCommentRequest request)
    {
        var comment = new PostComment
        {
            PostId = postId,
            AuthorId = userId,
            Content = request.Content,
            ParentId = request.ParentId
        };

        _context.PostComments.Add(comment);

        var post = await _context.Posts.FindAsync(postId);
        if (post != null) post.CommentCount++;

        await _context.SaveChangesAsync();

        var saved = await _context.PostComments
            .Include(c => c.Author)
            .FirstAsync(c => c.Id == comment.Id);

        return MapCommentToDto(saved);
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, Guid userId)
    {
        var comment = await _context.PostComments.FirstOrDefaultAsync(c => c.Id == commentId && c.AuthorId == userId);
        if (comment == null) return false;

        var post = await _context.Posts.FindAsync(comment.PostId);
        if (post != null && post.CommentCount > 0) post.CommentCount--;

        _context.PostComments.Remove(comment);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> LikeCommentAsync(Guid commentId, Guid userId)
    {
        var comment = await _context.PostComments.FindAsync(commentId);
        if (comment == null) return false;

        comment.LikeCount++;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<PostCategoryDto>> GetCategoriesAsync()
    {
        var categories = await _context.Set<PostCategory>().ToListAsync();
        return categories.Select(c => new PostCategoryDto(c.Id, c.Name, c.Slug, c.Icon));
    }

    private static string GenerateSlug(string title)
    {
        return title.ToLower().Replace(" ", "-").Replace("'", "").Replace("\"", "")
            + "-" + Guid.NewGuid().ToString()[..8];
    }

    private static PostDto MapToDto(Post p, bool isLiked) => new(
        p.Id, p.AuthorId,
        new PostAuthorDto(p.Author.Id, p.Author.FirstName ?? "", p.Author.LastName ?? "", p.Author.AvatarUrl, p.Author.UserType.ToString()),
        p.Title, p.Content, p.Slug, p.Type, p.Status.ToString(), p.Visibility.ToString(),
        p.CoverImageUrl,
        p.Media.Select(m => new PostMediaDto(m.Id, m.Url, m.Type.ToString(), m.ThumbnailUrl)).ToList(),
        p.CategoryId,
        p.Category != null ? new PostCategoryDto(p.Category.Id, p.Category.Name, p.Category.Slug, p.Category.Icon) : null,
        p.Tags.Select(t => t.Name).ToList(),
        p.GroupId, p.ViewCount, p.LikeCount, p.CommentCount, p.ShareCount,
        p.AllowComments, p.IsPinned, p.IsFeatured, isLiked, p.PublishedAt, p.CreatedAt
    );

    private static PostListDto MapToListDto(Post p, bool isLiked) => new(
        p.Id, p.AuthorId,
        new PostAuthorDto(p.Author.Id, p.Author.FirstName ?? "", p.Author.LastName ?? "", p.Author.AvatarUrl, p.Author.UserType.ToString()),
        p.Title, p.Content, p.Slug, p.Type, p.CoverImageUrl,
        p.Media.Select(m => new PostMediaDto(m.Id, m.Url, m.Type.ToString(), m.ThumbnailUrl)).ToList(),
        p.LikeCount, p.CommentCount, p.ShareCount, isLiked, p.PublishedAt, p.CreatedAt
    );

    private static PostCommentDto MapCommentToDto(PostComment c) => new(
        c.Id, c.PostId, c.AuthorId,
        new PostAuthorDto(c.Author.Id, c.Author.FirstName ?? "", c.Author.LastName ?? "", c.Author.AvatarUrl, c.Author.UserType.ToString()),
        c.Content, c.LikeCount, false, c.ParentId, null, c.CreatedAt
    );
}
