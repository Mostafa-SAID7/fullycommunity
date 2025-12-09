using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.DTOs.Response.Community.Posts;
using CommunityCar.Application.DTOs.Requests.Community.Posts;
using CommunityCar.Infrastructure.Services.Community.Posts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/posts")]
[ApiExplorerSettings(GroupName = "community")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;
    // private readonly PersonalizedFeedService _feedService; // TODO: Implement PersonalizedFeedService

    public PostsController(IPostService postService) // , PersonalizedFeedService feedService)
    {
        _postService = postService;
        // _feedService = feedService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] PostFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _postService.GetPostsAsync(filter, page, pageSize));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var post = await _postService.GetByIdAsync(id, GetUserId());
        return post is null ? NotFound() : Ok(post);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var post = await _postService.GetBySlugAsync(slug, GetUserId());
        return post is null ? NotFound() : Ok(post);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserPosts(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _postService.GetUserPostsAsync(userId, page, pageSize));

    [HttpGet("group/{groupId:guid}")]
    public async Task<IActionResult> GetGroupPosts(Guid groupId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _postService.GetGroupPostsAsync(groupId, page, pageSize));

    [HttpGet("feed")]
    [Authorize]
    public async Task<IActionResult> GetFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _postService.GetFeedAsync(GetUserId()!.Value, page, pageSize));

    // TODO: Implement PersonalizedFeedService
    // [HttpGet("feed/personalized")]
    // [Authorize]
    // public async Task<IActionResult> GetPersonalizedFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    //     => Ok(await _feedService.GetPersonalizedFeedAsync(GetUserId()!.Value, page, pageSize));

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreatePostRequest request)
    {
        var post = await _postService.CreateAsync(GetUserId()!.Value, request);
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, UpdatePostRequest request)
    {
        var post = await _postService.UpdateAsync(id, GetUserId()!.Value, request);
        return Ok(post);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
        => await _postService.DeleteAsync(id, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpPost("{id:guid}/publish")]
    [Authorize]
    public async Task<IActionResult> Publish(Guid id)
        => await _postService.PublishAsync(id, GetUserId()!.Value) ? Ok() : NotFound();

    [HttpPost("{id:guid}/like")]
    [Authorize]
    public async Task<IActionResult> Like(Guid id)
        => await _postService.LikeAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpDelete("{id:guid}/like")]
    [Authorize]
    public async Task<IActionResult> Unlike(Guid id)
        => await _postService.UnlikeAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpGet("{id:guid}/comments")]
    public async Task<IActionResult> GetComments(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _postService.GetCommentsAsync(id, page, pageSize));

    [HttpPost("{id:guid}/comments")]
    [Authorize]
    public async Task<IActionResult> AddComment(Guid id, CreateCommentRequest request)
        => Ok(await _postService.AddCommentAsync(id, GetUserId()!.Value, request));

    [HttpDelete("comments/{commentId:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(Guid commentId)
        => await _postService.DeleteCommentAsync(commentId, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
        => Ok(await _postService.GetCategoriesAsync());

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}
