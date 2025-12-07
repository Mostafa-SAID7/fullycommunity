using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Enums.Community.Posts;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community.Posts;

/// <summary>
/// Service for querying community posts
/// </summary>
public class PostQueryService
{
    private readonly IRepository<Post> _postRepository;
    private readonly IRepository<PostLike> _postLikeRepository;

    public PostQueryService(
        IRepository<Post> postRepository,
        IRepository<PostLike> postLikeRepository)
    {
        _postRepository = postRepository;
        _postLikeRepository = postLikeRepository;
    }

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

        return PostMapper.ToDto(postEntity, isLiked);
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

        return PostMapper.ToDto(postEntity, isLiked);
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
            items.Select(p => PostMapper.ToListDto(p, false)).ToList(),
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
            items.Select(p => PostMapper.ToListDto(p, false)).ToList(),
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
            items.Select(p => PostMapper.ToListDto(p, false)).ToList(),
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

        return orderedPosts.Select(p => PostMapper.ToListDto(p, likedPostIds.Contains(p.Id)));
    }
}
