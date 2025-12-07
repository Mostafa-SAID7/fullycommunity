using CommunityCar.Domain.Entities.Community.Friendships;
using CommunityCar.Domain.Enums.Community.Friendships;

namespace CommunityCar.Application.DTOs.Response.Community.Friendships;

public record FriendRequestDto(
    Guid Id,
    Guid RequesterId,
    string RequesterName,
    string? RequesterAvatarUrl,
    FriendshipStatus Status,
    DateTime CreatedAt
);
