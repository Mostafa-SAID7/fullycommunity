using CommunityCar.Domain.Entities.Community.Groups;

namespace CommunityCar.Application.DTOs.Response.Community.Groups;

public record GroupDto(
    Guid Id,
    string Name,
    string? Slug,
    string? Description,
    Guid OwnerId,
    string OwnerName,
    string? CoverImageUrl,
    string? AvatarUrl,
    GroupPrivacy Privacy,
    GroupType Type,
    bool RequiresApproval,
    bool AllowMemberPosts,
    int MemberCount,
    int PostCount,
    string? City,
    string? Country,
    string? Rules,
    GroupRole? CurrentUserRole,
    MemberStatus? CurrentUserStatus,
    DateTime CreatedAt
);
