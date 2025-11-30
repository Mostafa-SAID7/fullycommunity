using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Community.Friendships.DTOs;
using CommunityCar.Domain.Entities.Community.Friendships;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IFriendshipService
{
    // Friends
    Task<PagedResult<FriendDto>> GetFriendsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<PagedResult<FriendDto>> GetMutualFriendsAsync(Guid userId, Guid otherUserId, int page = 1, int pageSize = 20);
    Task<bool> AreFriendsAsync(Guid userId1, Guid userId2);
    Task<bool> UnfriendAsync(Guid userId, Guid friendId);

    // Friend Requests
    Task<bool> SendFriendRequestAsync(Guid requesterId, Guid addresseeId);
    Task<bool> AcceptFriendRequestAsync(Guid requestId, Guid userId);
    Task<bool> DeclineFriendRequestAsync(Guid requestId, Guid userId);
    Task<bool> CancelFriendRequestAsync(Guid requestId, Guid userId);
    Task<PagedResult<FriendRequestDto>> GetPendingRequestsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<PagedResult<FriendRequestDto>> GetSentRequestsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<FriendshipStatus?> GetFriendshipStatusAsync(Guid userId, Guid otherUserId);

    // Following
    Task<bool> FollowAsync(Guid followerId, Guid followingId);
    Task<bool> UnfollowAsync(Guid followerId, Guid followingId);
    Task<bool> IsFollowingAsync(Guid followerId, Guid followingId);
    Task<PagedResult<FollowerDto>> GetFollowersAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<PagedResult<FollowingDto>> GetFollowingAsync(Guid userId, int page = 1, int pageSize = 20);

    // Blocking
    Task<bool> BlockUserAsync(Guid blockerId, Guid blockedUserId, string? reason = null);
    Task<bool> UnblockUserAsync(Guid blockerId, Guid blockedUserId);
    Task<bool> IsBlockedAsync(Guid userId, Guid otherUserId);
    Task<IEnumerable<Guid>> GetBlockedUserIdsAsync(Guid userId);

    // Stats
    Task<UserSocialStatsDto> GetSocialStatsAsync(Guid userId);

    // Suggestions
    Task<IEnumerable<FriendDto>> GetSuggestedFriendsAsync(Guid userId, int count = 10);
}
