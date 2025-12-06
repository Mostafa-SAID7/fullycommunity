namespace CommunityCar.Application.DTOs.Response.Community.Friendships;

public record FriendDto(
    Guid UserId,
    string UserName,
    string? AvatarUrl,
    string? Bio,
    DateTime FriendsSince,
    bool IsOnline
);
