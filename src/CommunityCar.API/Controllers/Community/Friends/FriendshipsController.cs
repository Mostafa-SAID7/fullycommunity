using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.DTOs.Response.Community.Friendships;
using CommunityCar.Application.DTOs.Requests.Community.Friendships;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/friendships")]
[Authorize]
[ApiExplorerSettings(GroupName = "community")]
public class FriendshipsController : ControllerBase
{
    private readonly IFriendshipService _friendshipService;

    public FriendshipsController(IFriendshipService friendshipService) => _friendshipService = friendshipService;

    // Friends
    [HttpGet("friends")]
    public async Task<IActionResult> GetFriends([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetFriendsAsync(GetUserId(), page, pageSize));

    [HttpGet("friends/{userId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserFriends(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetFriendsAsync(userId, page, pageSize));

    [HttpGet("mutual/{userId:guid}")]
    public async Task<IActionResult> GetMutualFriends(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetMutualFriendsAsync(GetUserId(), userId, page, pageSize));

    [HttpDelete("friends/{friendId:guid}")]
    public async Task<IActionResult> Unfriend(Guid friendId)
        => await _friendshipService.UnfriendAsync(GetUserId(), friendId) ? Ok() : BadRequest();

    // Friend Requests
    [HttpPost("requests")]
    public async Task<IActionResult> SendFriendRequest(SendFriendRequestRequest request)
        => await _friendshipService.SendFriendRequestAsync(GetUserId(), request.AddresseeId) ? Ok() : BadRequest();

    [HttpGet("requests/pending")]
    public async Task<IActionResult> GetPendingRequests([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetPendingRequestsAsync(GetUserId(), page, pageSize));

    [HttpGet("requests/sent")]
    public async Task<IActionResult> GetSentRequests([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetSentRequestsAsync(GetUserId(), page, pageSize));

    [HttpPost("requests/{requestId:guid}/accept")]
    public async Task<IActionResult> AcceptRequest(Guid requestId)
        => await _friendshipService.AcceptFriendRequestAsync(requestId, GetUserId()) ? Ok() : BadRequest();

    [HttpPost("requests/{requestId:guid}/decline")]
    public async Task<IActionResult> DeclineRequest(Guid requestId)
        => await _friendshipService.DeclineFriendRequestAsync(requestId, GetUserId()) ? Ok() : BadRequest();

    [HttpDelete("requests/{requestId:guid}")]
    public async Task<IActionResult> CancelRequest(Guid requestId)
        => await _friendshipService.CancelFriendRequestAsync(requestId, GetUserId()) ? Ok() : BadRequest();

    [HttpGet("status/{userId:guid}")]
    public async Task<IActionResult> GetFriendshipStatus(Guid userId)
        => Ok(new { status = await _friendshipService.GetFriendshipStatusAsync(GetUserId(), userId) });

    // Following
    [HttpPost("follow/{userId:guid}")]
    public async Task<IActionResult> Follow(Guid userId)
        => await _friendshipService.FollowAsync(GetUserId(), userId) ? Ok() : BadRequest();

    [HttpDelete("follow/{userId:guid}")]
    public async Task<IActionResult> Unfollow(Guid userId)
        => await _friendshipService.UnfollowAsync(GetUserId(), userId) ? Ok() : BadRequest();

    [HttpGet("followers")]
    public async Task<IActionResult> GetFollowers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetFollowersAsync(GetUserId(), page, pageSize));

    [HttpGet("followers/{userId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserFollowers(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetFollowersAsync(userId, page, pageSize));

    [HttpGet("following")]
    public async Task<IActionResult> GetFollowing([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetFollowingAsync(GetUserId(), page, pageSize));

    [HttpGet("following/{userId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserFollowing(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _friendshipService.GetFollowingAsync(userId, page, pageSize));

    // Blocking
    [HttpPost("block")]
    public async Task<IActionResult> BlockUser(BlockUserRequest request)
        => await _friendshipService.BlockUserAsync(GetUserId(), request.UserId, request.Reason) ? Ok() : BadRequest();

    [HttpDelete("block/{userId:guid}")]
    public async Task<IActionResult> UnblockUser(Guid userId)
        => await _friendshipService.UnblockUserAsync(GetUserId(), userId) ? Ok() : BadRequest();

    // Stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
        => Ok(await _friendshipService.GetSocialStatsAsync(GetUserId()));

    [HttpGet("stats/{userId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetUserStats(Guid userId)
        => Ok(await _friendshipService.GetSocialStatsAsync(userId));

    // Suggestions
    [HttpGet("suggestions")]
    public async Task<IActionResult> GetSuggestions([FromQuery] int count = 10)
        => Ok(await _friendshipService.GetSuggestedFriendsAsync(GetUserId(), count));

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
