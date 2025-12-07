using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Domain.Enums.Community.Groups;

namespace CommunityCar.Application.DTOs.Response.Community.Groups;

public record GroupMemberDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    GroupRole Role,
    MemberStatus Status,
    DateTime JoinedAt
);
