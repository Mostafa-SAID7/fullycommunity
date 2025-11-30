using CommunityCar.Domain.Entities.Community.Groups;

namespace CommunityCar.Application.Features.Community.Groups.DTOs;

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

public record GroupMemberDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatarUrl,
    GroupRole Role,
    MemberStatus Status,
    DateTime JoinedAt
);

public record JoinGroupRequest(string? Message);
public record UpdateMemberRoleRequest(GroupRole Role);
