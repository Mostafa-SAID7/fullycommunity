using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Infrastructure.Services.Community.Posts;

/// <summary>
/// Service for post engagement operations (Like, Unlike, View)
/// </summary>
public class PostEngagementService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Post> _postRepository;
    private readonly IRepository<PostLike> _postLikeRepository;

    public PostEngagementService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _postRepository = unitOfWork.Repository<Post>();
        _postLikeRepository = unitOfWork.Repository<PostLike>();
    }

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
}
