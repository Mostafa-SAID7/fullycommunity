using CommunityCar.Application.DTOs.Response.Community.Friendships;
using CommunityCar.Domain.Entities.Community.Friendships;

namespace CommunityCar.Application.Common.Mappers.Community;

public static class FriendshipMapper
{
    public static FriendDto ToDto(Friendship friendship, Guid currentUserId)
    {
        var friend = friendship.RequesterId == currentUserId
            ? friendship.Addressee
            : friendship.Requester;

        return new FriendDto(
            UserId: friend?.Id ?? Guid.Empty,
            UserName: friend?.UserName ?? "Unknown",
            AvatarUrl: friend?.AvatarUrl,
            Bio: null,
            FriendsSince: friendship.CreatedAt,
            IsOnline: false
        );
    }

    public static FriendRequestDto ToRequestDto(Friendship friendship)
    {
        return new FriendRequestDto(
            Id: friendship.Id,
            RequesterId: friendship.RequesterId,
            RequesterName: friendship.Requester?.UserName ?? "Unknown",
            RequesterAvatarUrl: friendship.Requester?.AvatarUrl,
            Status: friendship.Status,
            CreatedAt: friendship.CreatedAt
        );
    }
}
