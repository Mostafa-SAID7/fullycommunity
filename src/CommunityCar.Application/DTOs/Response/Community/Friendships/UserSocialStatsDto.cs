namespace CommunityCar.Application.DTOs.Response.Community.Friendships;

public record UserSocialStatsDto(
    int FriendCount,
    int FollowerCount,
    int FollowingCount,
    int PendingRequestCount
);
