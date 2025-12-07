using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Domain.Enums.Community.Groups;

namespace CommunityCar.Application.DTOs.Response.Community.Groups;

public record GroupListDto(
    Guid Id,
    string Name,
    string? AvatarUrl,
    GroupPrivacy Privacy,
    GroupType Type,
    int MemberCount,
    string? City,
    string? Country,
    bool IsMember
);
