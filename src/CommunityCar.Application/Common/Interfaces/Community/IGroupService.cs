using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Community.Groups.DTOs;
using CommunityCar.Domain.Entities.Community.Groups;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IGroupService
{
    // Groups
    Task<GroupDto?> GetByIdAsync(Guid id, Guid? currentUserId = null);
    Task<GroupDto?> GetBySlugAsync(string slug, Guid? currentUserId = null);
    Task<PagedResult<GroupListDto>> GetGroupsAsync(GroupFilter filter, int page = 1, int pageSize = 20);
    Task<PagedResult<GroupListDto>> GetUserGroupsAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<IEnumerable<GroupListDto>> GetSuggestedGroupsAsync(Guid userId, int count = 10);
    Task<GroupDto> CreateAsync(Guid ownerId, CreateGroupRequest request);
    Task<GroupDto> UpdateAsync(Guid groupId, Guid userId, UpdateGroupRequest request);
    Task<bool> DeleteAsync(Guid groupId, Guid userId);
    
    // Membership
    Task<bool> JoinAsync(Guid groupId, Guid userId, JoinGroupRequest? request = null);
    Task<bool> LeaveAsync(Guid groupId, Guid userId);
    Task<bool> ApproveMemberAsync(Guid groupId, Guid memberId, Guid adminId);
    Task<bool> RejectMemberAsync(Guid groupId, Guid memberId, Guid adminId);
    Task<bool> RemoveMemberAsync(Guid groupId, Guid memberId, Guid adminId);
    Task<bool> BanMemberAsync(Guid groupId, Guid memberId, Guid adminId, string? reason = null);
    Task<bool> UpdateMemberRoleAsync(Guid groupId, Guid memberId, Guid adminId, UpdateMemberRoleRequest request);
    
    // Members
    Task<PagedResult<GroupMemberDto>> GetMembersAsync(Guid groupId, MemberStatus? status = null, int page = 1, int pageSize = 20);
    Task<GroupMemberDto?> GetMemberAsync(Guid groupId, Guid userId);
    Task<bool> IsMemberAsync(Guid groupId, Guid userId);
    Task<GroupRole?> GetUserRoleAsync(Guid groupId, Guid userId);
    
    // Invitations
    Task<bool> InviteUserAsync(Guid groupId, Guid inviterId, Guid inviteeId);
    Task<IEnumerable<GroupListDto>> GetPendingInvitationsAsync(Guid userId);
}

public record GroupFilter(
    GroupPrivacy? Privacy = null,
    GroupType? Type = null,
    string? SearchTerm = null,
    string? City = null,
    string? Country = null,
    string? SortBy = null // popular, newest, alphabetical
);
