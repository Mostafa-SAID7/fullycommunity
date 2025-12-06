namespace CommunityCar.Application.DTOs.Response.Community.Friendships;

public record FollowerDto(
    Guid UserId,
    string UserName,
    string? AvatarUrl,
    DateTime FollowedAt,
    bool IsFollowingBack
);
