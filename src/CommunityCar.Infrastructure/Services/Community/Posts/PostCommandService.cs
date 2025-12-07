using CommunityCar.Application.Common.Helpers;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.DTOs.Requests.Community.Posts;
using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Domain.Entities.Community.Posts;
using CommunityCar.Domain.Enums.Community.Posts;

namespace CommunityCar.Infrastructure.Services.Community.Posts;

/// <summary>
/// Service for post command operations (Create, Update, Delete)
/// </summary>
public class PostCommandService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Post> _postRepository;
    private readonly PostQueryService _queryService;

    public PostCommandService(
        IUnitOfWork unitOfWork,
        PostQueryService queryService)
    {
        _unitOfWork = unitOfWork;
        _postRepository = unitOfWork.Repository<Post>();
        _queryService = queryService;
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
            Slug = SlugHelper.GenerateSlug(request.Title)
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

        return (await _queryService.GetByIdAsync(post.Id, authorId))!;
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

        return (await _queryService.GetByIdAsync(postId, userId))!;
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
}
