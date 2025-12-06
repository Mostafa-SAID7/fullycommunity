namespace CommunityCar.Application.DTOs.Response.Community.Friendships;

public record FollowingDto(
    Guid UserId,
    string UserName,
    string? AvatarUrl,
    DateTime FollowedAt,
    bool IsFollowedBack
);
