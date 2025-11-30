using CommunityCar.Domain.Entities.Community.Friendships;

namespace CommunityCar.Application.Features.Community.Friendships.DTOs;

public record FriendDto(
    Guid UserId,
    string UserName,
    string? AvatarUrl,
    string? Bio,
    DateTime FriendsSince,
    bool IsOnline
);

public record FriendRequestDto(
    Guid Id,
    Guid RequesterId,
    string RequesterName,
    string? RequesterAvatarUrl,
    FriendshipStatus Status,
    DateTime CreatedAt
);

public record FollowerDto(
    Guid UserId,
    string UserName,
    string? AvatarUrl,
    DateTime FollowedAt,
    bool IsFollowingBack
);

public record FollowingDto(
    Guid UserId,
    string UserName,
    string? AvatarUrl,
    DateTime FollowedAt,
    bool IsFollowedBack
);

public record UserSocialStatsDto(
    int FriendCount,
    int FollowerCount,
    int FollowingCount,
    int PendingRequestCount
);

public record SendFriendRequestRequest(Guid AddresseeId);
public record RespondToFriendRequestRequest(bool Accept);
public record BlockUserRequest(Guid UserId, string? Reason);
