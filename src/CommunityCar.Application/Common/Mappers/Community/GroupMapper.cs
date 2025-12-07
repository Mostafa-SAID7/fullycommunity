using CommunityCar.Application.DTOs.Response.Community.Groups;
using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Domain.Enums.Community.Groups;

namespace CommunityCar.Application.Common.Mappers.Community;

/// <summary>
/// Mapper for Group entities to DTOs
/// </summary>
public static class GroupMapper
{
    public static GroupDto ToDto(Group group, GroupRole? currentUserRole = null, MemberStatus? currentUserStatus = null)
    {
        return new GroupDto(
            Id: group.Id,
            Name: group.Name,
            Slug: group.Slug,
            Description: group.Description,
            OwnerId: group.OwnerId,
            OwnerName: group.Owner?.UserName ?? "Unknown",
            CoverImageUrl: group.CoverImageUrl,
            AvatarUrl: group.AvatarUrl,
            Privacy: group.Privacy,
            Type: group.Type,
            RequiresApproval: group.RequiresApproval,
            AllowMemberPosts: group.AllowMemberPosts,
            MemberCount: group.MemberCount,
            PostCount: group.PostCount,
            City: group.City,
            Country: group.Country,
            Rules: group.Rules,
            CurrentUserRole: currentUserRole,
            CurrentUserStatus: currentUserStatus,
            CreatedAt: group.CreatedAt
        );
    }

    public static GroupListDto ToListDto(Group group, bool isMember = false)
    {
        return new GroupListDto(
            Id: group.Id,
            Name: group.Name,
            AvatarUrl: group.AvatarUrl,
            Privacy: group.Privacy,
            Type: group.Type,
            MemberCount: group.MemberCount,
            City: group.City,
            Country: group.Country,
            IsMember: isMember
        );
    }

    public static GroupMemberDto ToMemberDto(GroupMember member)
    {
        return new GroupMemberDto(
            Id: member.Id,
            UserId: member.UserId,
            UserName: member.User?.UserName ?? "Unknown",
            UserAvatarUrl: member.User?.AvatarUrl,
            Role: member.Role,
            Status: member.Status,
            JoinedAt: member.JoinedAt
        );
    }
}
