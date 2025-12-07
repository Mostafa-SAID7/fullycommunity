using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Community.Friendships;
using CommunityCar.Domain.Entities.Community.Friendships;
using CommunityCar.Domain.Enums.Community.Friendships;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Services.Community.Friendships;

public class FriendshipService : IFriendshipService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Friendship> _friendshipRepository;
    private readonly IRepository<UserFollow> _followRepository;
    private readonly IRepository<UserBlock> _blockRepository;

    public FriendshipService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _friendshipRepository = unitOfWork.Repository<Friendship>();
        _followRepository = unitOfWork.Repository<UserFollow>();
        _blockRepository = unitOfWork.Repository<UserBlock>();
    }

    #region Friends

    public async Task<PagedResult<FriendDto>> GetFriendsAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        var query = _friendshipRepository.AsQueryable()
            .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) &&
                       f.Status == FriendshipStatus.Accepted)
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .OrderByDescending(f => f.AcceptedAt);

        var totalCount = await query.CountAsync();
        var friendships = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<FriendDto>(
            friendships.Select(f => FriendshipMapper.ToDto(f, userId)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PagedResult<FriendDto>> GetMutualFriendsAsync(
        Guid userId,
        Guid otherUserId,
        int page = 1,
        int pageSize = 20)
    {
        var userFriends = await _friendshipRepository.GetAsync(f =>
            (f.RequesterId == userId || f.AddresseeId == userId) &&
            f.Status == FriendshipStatus.Accepted);

        var otherUserFriends = await _friendshipRepository.GetAsync(f =>
            (f.RequesterId == otherUserId || f.AddresseeId == otherUserId) &&
            f.Status == FriendshipStatus.Accepted);

        var userFriendIds = userFriends
            .Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
            .ToHashSet();

        var mutualFriendIds = otherUserFriends
            .Select(f => f.RequesterId == otherUserId ? f.AddresseeId : f.RequesterId)
            .Where(id => userFriendIds.Contains(id))
            .ToList();

        var mutualFriendships = userFriends
            .Where(f =>
            {
                var friendId = f.RequesterId == userId ? f.AddresseeId : f.RequesterId;
                return mutualFriendIds.Contains(friendId);
            })
            .OrderByDescending(f => f.AcceptedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return new PagedResult<FriendDto>(
            mutualFriendships.Select(f => FriendshipMapper.ToDto(f, userId)).ToList(),
            mutualFriendIds.Count,
            page,
            pageSize
        );
    }

    public async Task<bool> AreFriendsAsync(Guid userId1, Guid userId2)
    {
        return await _friendshipRepository.AnyAsync(f =>
            ((f.RequesterId == userId1 && f.AddresseeId == userId2) ||
             (f.RequesterId == userId2 && f.AddresseeId == userId1)) &&
            f.Status == FriendshipStatus.Accepted);
    }

    public async Task<bool> UnfriendAsync(Guid userId, Guid friendId)
    {
        var friendship = await _friendshipRepository.FirstOrDefaultAsync(f =>
            ((f.RequesterId == userId && f.AddresseeId == friendId) ||
             (f.RequesterId == friendId && f.AddresseeId == userId)) &&
            f.Status == FriendshipStatus.Accepted);

        if (friendship == null) return false;

        _friendshipRepository.Delete(friendship);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Friend Requests

    public async Task<bool> SendFriendRequestAsync(Guid requesterId, Guid addresseeId)
    {
        if (requesterId == addresseeId) return false;

        var existing = await _friendshipRepository.FirstOrDefaultAsync(f =>
            (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
            (f.RequesterId == addresseeId && f.AddresseeId == requesterId));

        if (existing != null) return false;

        var friendship = new Friendship
        {
            RequesterId = requesterId,
            AddresseeId = addresseeId,
            Status = FriendshipStatus.Pending
        };

        await _friendshipRepository.AddAsync(friendship);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> AcceptFriendRequestAsync(Guid requestId, Guid userId)
    {
        var friendship = await _friendshipRepository.FirstOrDefaultAsync(f =>
            f.Id == requestId &&
            f.AddresseeId == userId &&
            f.Status == FriendshipStatus.Pending);

        if (friendship == null) return false;

        friendship.Status = FriendshipStatus.Accepted;
        friendship.AcceptedAt = DateTime.UtcNow;

        _friendshipRepository.Update(friendship);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeclineFriendRequestAsync(Guid requestId, Guid userId)
    {
        var friendship = await _friendshipRepository.FirstOrDefaultAsync(f =>
            f.Id == requestId &&
            f.AddresseeId == userId &&
            f.Status == FriendshipStatus.Pending);

        if (friendship == null) return false;

        _friendshipRepository.Delete(friendship);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CancelFriendRequestAsync(Guid requestId, Guid userId)
    {
        var friendship = await _friendshipRepository.FirstOrDefaultAsync(f =>
            f.Id == requestId &&
            f.RequesterId == userId &&
            f.Status == FriendshipStatus.Pending);

        if (friendship == null) return false;

        _friendshipRepository.Delete(friendship);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<PagedResult<FriendRequestDto>> GetPendingRequestsAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _friendshipRepository.AsQueryable()
            .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .OrderByDescending(f => f.CreatedAt);

        var totalCount = await query.CountAsync();
        var requests = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<FriendRequestDto>(
            requests.Select(FriendshipMapper.ToRequestDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PagedResult<FriendRequestDto>> GetSentRequestsAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _friendshipRepository.AsQueryable()
            .Where(f => f.RequesterId == userId && f.Status == FriendshipStatus.Pending)
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .OrderByDescending(f => f.CreatedAt);

        var totalCount = await query.CountAsync();
        var requests = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<FriendRequestDto>(
            requests.Select(FriendshipMapper.ToRequestDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<FriendshipStatus?> GetFriendshipStatusAsync(Guid userId, Guid otherUserId)
    {
        var friendship = await _friendshipRepository.FirstOrDefaultAsync(f =>
            (f.RequesterId == userId && f.AddresseeId == otherUserId) ||
            (f.RequesterId == otherUserId && f.AddresseeId == userId));

        return friendship?.Status;
    }

    #endregion

    #region Following

    public async Task<bool> FollowAsync(Guid followerId, Guid followingId)
    {
        if (followerId == followingId) return false;

        var existing = await _followRepository.FirstOrDefaultAsync(f =>
            f.FollowerId == followerId && f.FollowingId == followingId);

        if (existing != null) return false;

        await _followRepository.AddAsync(new UserFollow
        {
            FollowerId = followerId,
            FollowingId = followingId
        });

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnfollowAsync(Guid followerId, Guid followingId)
    {
        var follow = await _followRepository.FirstOrDefaultAsync(f =>
            f.FollowerId == followerId && f.FollowingId == followingId);

        if (follow == null) return false;

        _followRepository.Delete(follow);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> IsFollowingAsync(Guid followerId, Guid followingId)
    {
        return await _followRepository.AnyAsync(f =>
            f.FollowerId == followerId && f.FollowingId == followingId);
    }

    public async Task<PagedResult<FollowerDto>> GetFollowersAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _followRepository.AsQueryable()
            .Where(f => f.FollowingId == userId)
            .Include(f => f.Follower)
            .OrderByDescending(f => f.CreatedAt);

        var totalCount = await query.CountAsync();
        var follows = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        var followerIds = follows.Select(f => f.FollowerId).ToList();
        var followBacks = await _followRepository.GetAsync(f =>
            f.FollowerId == userId && followerIds.Contains(f.FollowingId));
        var followBackIds = followBacks.Select(f => f.FollowingId).ToHashSet();

        return new PagedResult<FollowerDto>(
            follows.Select(f => new FollowerDto(
                f.FollowerId,
                f.Follower?.UserName ?? "Unknown",
                f.Follower?.AvatarUrl,
                f.CreatedAt,
                followBackIds.Contains(f.FollowerId)
            )).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PagedResult<FollowingDto>> GetFollowingAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _followRepository.AsQueryable()
            .Where(f => f.FollowerId == userId)
            .Include(f => f.Following)
            .OrderByDescending(f => f.CreatedAt);

        var totalCount = await query.CountAsync();
        var follows = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        var followingIds = follows.Select(f => f.FollowingId).ToList();
        var followBacks = await _followRepository.GetAsync(f =>
            f.FollowerId != userId && followingIds.Contains(f.FollowerId) && f.FollowingId == userId);
        var followBackIds = followBacks.Select(f => f.FollowerId).ToHashSet();

        return new PagedResult<FollowingDto>(
            follows.Select(f => new FollowingDto(
                f.FollowingId,
                f.Following?.UserName ?? "Unknown",
                f.Following?.AvatarUrl,
                f.CreatedAt,
                followBackIds.Contains(f.FollowingId)
            )).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    #endregion

    #region Blocking

    public async Task<bool> BlockUserAsync(Guid blockerId, Guid blockedUserId, string? reason = null)
    {
        if (blockerId == blockedUserId) return false;

        var existing = await _blockRepository.FirstOrDefaultAsync(b =>
            b.BlockerId == blockerId && b.BlockedUserId == blockedUserId);

        if (existing != null) return false;

        await _blockRepository.AddAsync(new UserBlock
        {
            BlockerId = blockerId,
            BlockedUserId = blockedUserId,
            Reason = reason
        });

        // Remove friendship if exists
        var friendship = await _friendshipRepository.FirstOrDefaultAsync(f =>
            (f.RequesterId == blockerId && f.AddresseeId == blockedUserId) ||
            (f.RequesterId == blockedUserId && f.AddresseeId == blockerId));

        if (friendship != null)
            _friendshipRepository.Delete(friendship);

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnblockUserAsync(Guid blockerId, Guid blockedUserId)
    {
        var block = await _blockRepository.FirstOrDefaultAsync(b =>
            b.BlockerId == blockerId && b.BlockedUserId == blockedUserId);

        if (block == null) return false;

        _blockRepository.Delete(block);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> IsBlockedAsync(Guid userId, Guid otherUserId)
    {
        return await _blockRepository.AnyAsync(b =>
            (b.BlockerId == userId && b.BlockedUserId == otherUserId) ||
            (b.BlockerId == otherUserId && b.BlockedUserId == userId));
    }

    public async Task<IEnumerable<Guid>> GetBlockedUserIdsAsync(Guid userId)
    {
        var blocks = await _blockRepository.GetAsync(b => b.BlockerId == userId);
        return blocks.Select(b => b.BlockedUserId);
    }

    #endregion

    #region Stats

    public async Task<UserSocialStatsDto> GetSocialStatsAsync(Guid userId)
    {
        var friendCount = await _friendshipRepository.CountAsync(f =>
            (f.RequesterId == userId || f.AddresseeId == userId) &&
            f.Status == FriendshipStatus.Accepted);

        var followerCount = await _followRepository.CountAsync(f => f.FollowingId == userId);
        var followingCount = await _followRepository.CountAsync(f => f.FollowerId == userId);

        var pendingRequestCount = await _friendshipRepository.CountAsync(f =>
            f.AddresseeId == userId && f.Status == FriendshipStatus.Pending);

        return new UserSocialStatsDto(
            FriendCount: friendCount,
            FollowerCount: followerCount,
            FollowingCount: followingCount,
            PendingRequestCount: pendingRequestCount
        );
    }

    #endregion

    #region Suggestions

    public async Task<IEnumerable<FriendDto>> GetSuggestedFriendsAsync(Guid userId, int count = 10)
    {
        var userFriends = await _friendshipRepository.GetAsync(f =>
            (f.RequesterId == userId || f.AddresseeId == userId) &&
            f.Status == FriendshipStatus.Accepted);

        var friendIds = userFriends
            .Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
            .ToHashSet();

        var friendsOfFriends = await _friendshipRepository
            .GetWithIncludesAsync(
                f => (friendIds.Contains(f.RequesterId) || friendIds.Contains(f.AddresseeId)) &&
                     f.Status == FriendshipStatus.Accepted,
                f => f.Requester,
                f => f.Addressee
            );

        var suggestions = friendsOfFriends
            .Select(f => f.RequesterId != userId && !friendIds.Contains(f.RequesterId)
                ? f.RequesterId
                : f.AddresseeId != userId && !friendIds.Contains(f.AddresseeId)
                    ? f.AddresseeId
                    : Guid.Empty)
            .Where(id => id != Guid.Empty && id != userId)
            .Distinct()
            .Take(count)
            .ToList();

        var suggestionFriendships = friendsOfFriends
            .Where(f => suggestions.Contains(f.RequesterId) || suggestions.Contains(f.AddresseeId))
            .Take(count);

        return suggestionFriendships.Select(f => FriendshipMapper.ToDto(f, userId));
    }

    #endregion
}
