using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Domain.Enums.Community.Groups;

namespace CommunityCar.Application.DTOs.Requests.Community.Groups;

public record UpdateGroupRequest(
    string? Name,
    string? Description,
    GroupPrivacy? Privacy,
    bool? RequiresApproval,
    bool? AllowMemberPosts,
    string? CoverImageUrl,
    string? AvatarUrl,
    string? Rules
);
