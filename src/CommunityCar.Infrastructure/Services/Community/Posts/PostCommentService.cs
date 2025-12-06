using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.Posts;
using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Domain.Entities.Community.Posts;

namespace CommunityCar.Infrastructure.Services.Community.Posts;

/// <summary>
/// Service for post comment operations
/// </summary>
public class PostCommentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Post> _postRepository;
    private readonly IRepository<PostComment> _commentRepository;

    public PostCommentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _postRepository = unitOfWork.Repository<Post>();
        _commentRepository = unitOfWork.Repository<PostComment>();
    }

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
            comments.Select(PostMapper.ToCommentDto).ToList(),
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

        return PostMapper.ToCommentDto(saved.First());
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
}
