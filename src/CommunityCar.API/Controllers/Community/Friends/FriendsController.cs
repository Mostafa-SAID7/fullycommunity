using CommunityCar.Application.DTOs.Response.Community.Friendships;
using CommunityCar.Application.DTOs.Requests.Community.Friendships;
using CommunityCar.Domain.Entities.Community.Friendships;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/friends")]
[ApiExplorerSettings(GroupName = "community")]
[Authorize]
public class FriendsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FriendsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetFriends([FromQuery] string? search = null)
    {
        var userId = GetUserId();
        if (!userId.HasValue) return Unauthorized();

        var friendsQuery = _context.Set<Friendship>()
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) && f.Status == FriendshipStatus.Accepted);

        if (!string.IsNullOrEmpty(search))
        {
            friendsQuery = friendsQuery.Where(f => 
                (f.RequesterId == userId && (f.Addressee.FirstName.Contains(search) || f.Addressee.LastName.Contains(search))) ||
                (f.AddresseeId == userId && (f.Requester.FirstName.Contains(search) || f.Requester.LastName.Contains(search))));
        }

        var friends = await friendsQuery
            .Select(f => new FriendDto(
                f.RequesterId == userId ? f.Addressee.Id : f.Requester.Id,
                f.RequesterId == userId ? f.Addressee.FirstName : f.Requester.FirstName,
                f.RequesterId == userId ? f.Addressee.LastName : f.Requester.LastName,
                f.RequesterId == userId ? f.Addressee.AvatarUrl : f.Requester.AvatarUrl,
                f.RequesterId == userId ? f.Addressee.UserType.ToString() : f.Requester.UserType.ToString(),
                f.AcceptedAt ?? f.CreatedAt,
                GetMutualFriendsCount(userId.Value, f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
            ))
            .OrderBy(f => f.FirstName)
            .ToListAsync();

        return Ok(friends);
    }

    [HttpGet("requests")]
    public async Task<IActionResult> GetFriendRequests()
    {
        var userId = GetUserId();
        if (!userId.HasValue) return Unauthorized();

        var requests = await _context.Set<Friendship>()
            .Include(f => f.Requester)
            .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
            .Select(f => new FriendRequestDto(
                f.Id,
                f.Requester.Id,
                f.Requester.FirstName,
                f.Requester.LastName,
                f.Requester.AvatarUrl,
                f.Requester.UserType.ToString(),
                f.CreatedAt,
                GetMutualFriendsCount(userId.Value, f.RequesterId)
            ))
            .OrderByDescending(f => f.RequestedAt)
            .ToListAsync();

        return Ok(requests);
    }

    [HttpGet("suggestions")]
    public async Task<IActionResult> GetFriendSuggestions()
    {
        var userId = GetUserId();
        if (!userId.HasValue) return Unauthorized();

        // Get users who are not already friends and not blocked
        var existingFriendIds = await _context.Set<Friendship>()
            .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) && f.Status != FriendshipStatus.Declined)
            .Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
            .ToListAsync();

        var blockedUserIds = await _context.Set<UserBlock>()
            .Where(b => b.BlockerId == userId || b.BlockedUserId == userId)
            .Select(b => b.BlockerId == userId ? b.BlockedUserId : b.BlockerId)
            .ToListAsync();

        var excludedIds = existingFriendIds.Concat(blockedUserIds).Append(userId.Value).ToList();

        var suggestions = await _context.Users
            .Where(u => !excludedIds.Contains(u.Id) && u.CanBeFriend && u.EmailConfirmed)
            .OrderBy(u => Guid.NewGuid()) // Random order
            .Take(10)
            .Select(u => new FriendSuggestionDto(
                u.Id,
                u.FirstName,
                u.LastName,
                u.AvatarUrl,
                u.UserType.ToString(),
                GetMutualFriendsCount(userId.Value, u.Id),
                "Suggested for you" // Simple reason for now
            ))
            .ToListAsync();

        return Ok(suggestions);
    }

    [HttpPost("request/{userId:guid}")]
    public async Task<IActionResult> SendFriendRequest(Guid userId)
    {
        var currentUserId = GetUserId();
        if (!currentUserId.HasValue) return Unauthorized();

        if (currentUserId == userId) return BadRequest("Cannot send friend request to yourself");

        // Check if friendship already exists
        var existingFriendship = await _context.Set<Friendship>()
            .FirstOrDefaultAsync(f => 
                (f.RequesterId == currentUserId && f.AddresseeId == userId) ||
                (f.RequesterId == userId && f.AddresseeId == currentUserId));

        if (existingFriendship != null)
        {
            return BadRequest("Friendship request already exists");
        }

        var friendship = new Friendship
        {
            RequesterId = currentUserId.Value,
            AddresseeId = userId,
            Status = FriendshipStatus.Pending
        };

        _context.Set<Friendship>().Add(friendship);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Friend request sent successfully" });
    }

    [HttpPost("accept/{requestId:guid}")]
    public async Task<IActionResult> AcceptFriendRequest(Guid requestId)
    {
        var userId = GetUserId();
        if (!userId.HasValue) return Unauthorized();

        var friendship = await _context.Set<Friendship>()
            .FirstOrDefaultAsync(f => f.Id == requestId && f.AddresseeId == userId && f.Status == FriendshipStatus.Pending);

        if (friendship == null) return NotFound("Friend request not found");

        friendship.Status = FriendshipStatus.Accepted;
        friendship.AcceptedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Friend request accepted" });
    }

    [HttpPost("decline/{requestId:guid}")]
    public async Task<IActionResult> DeclineFriendRequest(Guid requestId)
    {
        var userId = GetUserId();
        if (!userId.HasValue) return Unauthorized();

        var friendship = await _context.Set<Friendship>()
            .FirstOrDefaultAsync(f => f.Id == requestId && f.AddresseeId == userId && f.Status == FriendshipStatus.Pending);

        if (friendship == null) return NotFound("Friend request not found");

        friendship.Status = FriendshipStatus.Declined;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Friend request declined" });
    }

    [HttpDelete("{friendId:guid}")]
    public async Task<IActionResult> RemoveFriend(Guid friendId)
    {
        var userId = GetUserId();
        if (!userId.HasValue) return Unauthorized();

        var friendship = await _context.Set<Friendship>()
            .FirstOrDefaultAsync(f => 
                ((f.RequesterId == userId && f.AddresseeId == friendId) ||
                 (f.RequesterId == friendId && f.AddresseeId == userId)) &&
                f.Status == FriendshipStatus.Accepted);

        if (friendship == null) return NotFound("Friendship not found");

        _context.Set<Friendship>().Remove(friendship);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Friend removed successfully" });
    }

    [HttpPost("block/{userId:guid}")]
    public async Task<IActionResult> BlockUser(Guid userId, [FromBody] BlockUserReasonRequest request)
    {
        var currentUserId = GetUserId();
        if (!currentUserId.HasValue) return Unauthorized();

        if (currentUserId == userId) return BadRequest("Cannot block yourself");

        // Remove existing friendship if any
        var existingFriendship = await _context.Set<Friendship>()
            .FirstOrDefaultAsync(f => 
                (f.RequesterId == currentUserId && f.AddresseeId == userId) ||
                (f.RequesterId == userId && f.AddresseeId == currentUserId));

        if (existingFriendship != null)
        {
            _context.Set<Friendship>().Remove(existingFriendship);
        }

        // Add block record
        var block = new UserBlock
        {
            BlockerId = currentUserId.Value,
            BlockedUserId = userId,
            Reason = request.Reason
        };

        _context.Set<UserBlock>().Add(block);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User blocked successfully" });
    }

    [HttpDelete("unblock/{userId:guid}")]
    public async Task<IActionResult> UnblockUser(Guid userId)
    {
        var currentUserId = GetUserId();
        if (!currentUserId.HasValue) return Unauthorized();

        var block = await _context.Set<UserBlock>()
            .FirstOrDefaultAsync(b => b.BlockerId == currentUserId && b.BlockedUserId == userId);

        if (block == null) return NotFound("Block record not found");

        _context.Set<UserBlock>().Remove(block);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User unblocked successfully" });
    }

    private Guid? GetUserId()
    {
        return User.Identity?.IsAuthenticated == true 
            ? Guid.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst("id")?.Value ?? "")
            : null;
    }

    private int GetMutualFriendsCount(Guid userId1, Guid userId2)
    {
        // This is a simplified version - in a real app you'd want to optimize this query
        return 0; // Placeholder for now
    }
}

public record FriendDto(
    Guid Id,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType,
    DateTime FriendsSince,
    int MutualFriends
);

public record FriendRequestDto(
    Guid RequestId,
    Guid UserId,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType,
    DateTime RequestedAt,
    int MutualFriends
);

public record FriendSuggestionDto(
    Guid Id,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType,
    int MutualFriends,
    string Reason
);

public record BlockUserReasonRequest(string? Reason);

