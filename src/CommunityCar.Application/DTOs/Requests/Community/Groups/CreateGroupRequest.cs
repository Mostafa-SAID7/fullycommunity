using CommunityCar.Domain.Entities.Community.Groups;

namespace CommunityCar.Application.DTOs.Requests.Community.Groups;

public record CreateGroupRequest(
    string Name,
    string? Description,
    GroupPrivacy Privacy,
    GroupType Type,
    bool RequiresApproval,
    bool AllowMemberPosts,
    string? City,
    string? Country,
    string? Rules
);
