using CommunityCar.Application.Common.Helpers;
using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.Groups;
using CommunityCar.Application.DTOs.Response.Community.Groups;
using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Domain.Enums.Community.Groups;
using Microsoft.EntityFrameworkCore;
using static CommunityCar.Application.Common.Interfaces.Community.IGroupService;

namespace CommunityCar.Infrastructure.Services.Community.Groups;

/// <summary>
/// Service for managing community groups
/// </summary>
public class GroupService : IGroupService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<Group> _groupRepository;
    private readonly IRepository<GroupMember> _memberRepository;

    public GroupService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _groupRepository = unitOfWork.Repository<Group>();
        _memberRepository = unitOfWork.Repository<GroupMember>();
    }

    #region Group Query Operations

    public async Task<GroupDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var groups = await _groupRepository.GetWithIncludesAsync(
            g => g.Id == id,
            g => g.Owner
        );

        if (!groups.Any()) return null;

        var group = groups.First();
        return await EnrichGroupDto(group, currentUserId);
    }

    public async Task<GroupDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        var groups = await _groupRepository.GetWithIncludesAsync(
            g => g.Slug == slug,
            g => g.Owner
        );

        if (!groups.Any()) return null;

        var group = groups.First();
        return await EnrichGroupDto(group, currentUserId);
    }

    public async Task<PagedResult<GroupListDto>> GetGroupsAsync(
        GroupFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _groupRepository.AsQueryable();

        if (filter.Privacy.HasValue)
            query = query.Where(g => g.Privacy == filter.Privacy.Value);

        if (filter.Type.HasValue)
            query = query.Where(g => g.Type == filter.Type.Value);

        if (!string.IsNullOrEmpty(filter.City))
            query = query.Where(g => g.City == filter.City);

        if (!string.IsNullOrEmpty(filter.Country))
            query = query.Where(g => g.Country == filter.Country);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(g =>
                g.Name.Contains(filter.SearchTerm) ||
                (g.Description != null && g.Description.Contains(filter.SearchTerm)));

        query = filter.SortBy switch
        {
            "popular" => query.OrderByDescending(g => g.MemberCount),
            "alphabetical" => query.OrderBy(g => g.Name),
            _ => query.OrderByDescending(g => g.CreatedAt) // newest
        };

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<GroupListDto>(
            items.Select(g => GroupMapper.ToListDto(g, false)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<PagedResult<GroupListDto>> GetUserGroupsAsync(
        Guid userId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _memberRepository.AsQueryable()
            .Where(m => m.UserId == userId && m.Status == MemberStatus.Active)
            .Include(m => m.Group)
            .OrderByDescending(m => m.JoinedAt);

        var totalCount = await query.CountAsync();
        var members = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var groups = members.Select(m => m.Group).ToList();

        return new PagedResult<GroupListDto>(
            groups.Select(g => GroupMapper.ToListDto(g, true)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<IEnumerable<GroupListDto>> GetSuggestedGroupsAsync(Guid userId, int count = 10)
    {
        var userGroupIds = (await _memberRepository.GetAsync(m => m.UserId == userId))
            .Select(m => m.GroupId)
            .ToList();

        var groups = await _groupRepository.GetAsync(g =>
            !userGroupIds.Contains(g.Id) &&
            g.Privacy == GroupPrivacy.Public);

        return groups
            .OrderByDescending(g => g.MemberCount)
            .Take(count)
            .Select(g => GroupMapper.ToListDto(g, false));
    }

    #endregion

    #region Group Command Operations

    public async Task<GroupDto> CreateAsync(Guid ownerId, CreateGroupRequest request)
    {
        var group = new Group
        {
            Name = request.Name,
            Description = request.Description,
            OwnerId = ownerId,
            Privacy = request.Privacy,
            Type = request.Type,
            RequiresApproval = request.RequiresApproval,
            City = request.City,
            Country = request.Country,
            Slug = SlugHelper.GenerateSlug(request.Name)
        };

        await _groupRepository.AddAsync(group);

        // Add owner as admin member
        var ownerMember = new GroupMember
        {
            GroupId = group.Id,
            UserId = ownerId,
            Role = GroupRole.Admin,
            Status = MemberStatus.Active
        };

        await _memberRepository.AddAsync(ownerMember);

        group.MemberCount = 1;
        _groupRepository.Update(group);

        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(group.Id, ownerId))!;
    }

    public async Task<GroupDto> UpdateAsync(Guid groupId, Guid userId, UpdateGroupRequest request)
    {
        var group = await _groupRepository.FirstOrDefaultAsync(g => g.Id == groupId)
            ?? throw new InvalidOperationException("Group not found");

        var member = await _memberRepository.FirstOrDefaultAsync(
            m => m.GroupId == groupId && m.UserId == userId);

        if (member == null || (member.Role != GroupRole.Admin && member.Role != GroupRole.Moderator))
            throw new InvalidOperationException("Unauthorized");

        if (request.Name != null)
        {
            group.Name = request.Name;
            group.Slug = SlugHelper.GenerateSlug(request.Name);
        }

        if (request.Description != null)
            group.Description = request.Description;

        if (request.Privacy.HasValue)
            group.Privacy = request.Privacy.Value;

        if (request.RequiresApproval.HasValue)
            group.RequiresApproval = request.RequiresApproval.Value;

        _groupRepository.Update(group);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(groupId, userId))!;
    }

    public async Task<bool> DeleteAsync(Guid groupId, Guid userId)
    {
        var group = await _groupRepository.FirstOrDefaultAsync(
            g => g.Id == groupId && g.OwnerId == userId);

        if (group == null) return false;

        _groupRepository.Delete(group);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Membership Operations

    public async Task<bool> JoinAsync(Guid groupId, Guid userId, JoinGroupRequest? request = null)
    {
        var group = await _groupRepository.FirstOrDefaultAsync(g => g.Id == groupId)
            ?? throw new InvalidOperationException("Group not found");

        var existingMember = await _memberRepository.FirstOrDefaultAsync(
            m => m.GroupId == groupId && m.UserId == userId);

        if (existingMember != null)
            return false; // Already a member

        var member = new GroupMember
        {
            GroupId = groupId,
            UserId = userId,
            Status = group.RequiresApproval ? MemberStatus.Pending : MemberStatus.Active,
            Role = GroupRole.Member
        };

        await _memberRepository.AddAsync(member);

        if (!group.RequiresApproval)
        {
            group.MemberCount++;
            _groupRepository.Update(group);
        }

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> LeaveAsync(Guid groupId, Guid userId)
    {
        var member = await _memberRepository.FirstOrDefaultAsync(
            m => m.GroupId == groupId && m.UserId == userId);

        if (member == null) return false;

        var group = await _groupRepository.FirstOrDefaultAsync(g => g.Id == groupId);
        if (group != null && member.Status == MemberStatus.Active)
        {
            group.MemberCount--;
            _groupRepository.Update(group);
        }

        _memberRepository.Delete(member);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ApproveMemberAsync(Guid groupId, Guid memberId, Guid adminId)
    {
        if (!await IsAdminOrModeratorAsync(groupId, adminId))
            throw new InvalidOperationException("Unauthorized");

        var member = await _memberRepository.FirstOrDefaultAsync(
            m => m.Id == memberId && m.GroupId == groupId);

        if (member == null || member.Status != MemberStatus.Pending)
            return false;

        member.Status = MemberStatus.Active;
        member.ApprovedAt = DateTime.UtcNow;
        _memberRepository.Update(member);

        var group = await _groupRepository.FirstOrDefaultAsync(g => g.Id == groupId);
        if (group != null)
        {
            group.MemberCount++;
            _groupRepository.Update(group);
        }

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RejectMemberAsync(Guid groupId, Guid memberId, Guid adminId)
    {
        if (!await IsAdminOrModeratorAsync(groupId, adminId))
            throw new InvalidOperationException("Unauthorized");

        var member = await _memberRepository.FirstOrDefaultAsync(
            m => m.Id == memberId && m.GroupId == groupId);

        if (member == null) return false;

        _memberRepository.Delete(member);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveMemberAsync(Guid groupId, Guid memberId, Guid adminId)
    {
        if (!await IsAdminOrModeratorAsync(groupId, adminId))
            throw new InvalidOperationException("Unauthorized");

        return await RejectMemberAsync(groupId, memberId, adminId);
    }

    public async Task<bool> BanMemberAsync(Guid groupId, Guid memberId, Guid adminId, string? reason = null)
    {
        if (!await IsAdminOrModeratorAsync(groupId, adminId))
            throw new InvalidOperationException("Unauthorized");

        var member = await _memberRepository.FirstOrDefaultAsync(
            m => m.Id == memberId && m.GroupId == groupId);

        if (member == null) return false;

        member.Status = MemberStatus.Banned;
        _memberRepository.Update(member);

        var group = await _groupRepository.FirstOrDefaultAsync(g => g.Id == groupId);
        if (group != null)
        {
            group.MemberCount--;
            _groupRepository.Update(group);
        }

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateMemberRoleAsync(
        Guid groupId,
        Guid memberId,
        Guid adminId,
        UpdateMemberRoleRequest request)
    {
        if (!await IsAdminOrModeratorAsync(groupId, adminId))
            throw new InvalidOperationException("Unauthorized");

        var member = await _memberRepository.FirstOrDefaultAsync(
            m => m.Id == memberId && m.GroupId == groupId);

        if (member == null) return false;

        member.Role = request.Role;
        _memberRepository.Update(member);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Member Query Operations

    public async Task<PagedResult<GroupMemberDto>> GetMembersAsync(
        Guid groupId,
        MemberStatus? status = null,
        int page = 1,
        int pageSize = 20)
    {
        var baseQuery = _memberRepository.AsQueryable()
            .Where(m => m.GroupId == groupId);

        if (status.HasValue)
            baseQuery = baseQuery.Where(m => m.Status == status.Value);

        var query = baseQuery
            .Include(m => m.User)
            .OrderByDescending(m => m.JoinedAt);

        var totalCount = await baseQuery.CountAsync();
        var members = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<GroupMemberDto>(
            members.Select(GroupMapper.ToMemberDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<GroupMemberDto?> GetMemberAsync(Guid groupId, Guid userId)
    {
        var members = await _memberRepository.GetWithIncludesAsync(
            m => m.GroupId == groupId && m.UserId == userId,
            m => m.User
        );

        return members.Any() ? GroupMapper.ToMemberDto(members.First()) : null;
    }

    public async Task<bool> IsMemberAsync(Guid groupId, Guid userId)
    {
        return await _memberRepository.AnyAsync(
            m => m.GroupId == groupId && m.UserId == userId && m.Status == MemberStatus.Active);
    }

    public async Task<GroupRole?> GetUserRoleAsync(Guid groupId, Guid userId)
    {
        var member = await _memberRepository.FirstOrDefaultAsync(
            m => m.GroupId == groupId && m.UserId == userId && m.Status == MemberStatus.Active);

        return member?.Role;
    }

    #endregion

    #region Invitation Operations

    public async Task<bool> InviteUserAsync(Guid groupId, Guid inviterId, Guid inviteeId)
    {
        if (!await IsMemberAsync(groupId, inviterId))
            throw new InvalidOperationException("Only members can invite");

        var existingMember = await _memberRepository.FirstOrDefaultAsync(
            m => m.GroupId == groupId && m.UserId == inviteeId);

        if (existingMember != null)
            return false; // Already a member or invited

        var member = new GroupMember
        {
            GroupId = groupId,
            UserId = inviteeId,
            Status = MemberStatus.Pending,
            InvitedBy = inviterId,
            Role = GroupRole.Member
        };

        await _memberRepository.AddAsync(member);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<GroupListDto>> GetPendingInvitationsAsync(Guid userId)
    {
        var invitations = await _memberRepository
            .GetWithIncludesAsync(
                m => m.UserId == userId && m.Status == MemberStatus.Pending && m.InvitedBy != null,
                m => m.Group
            );

        return invitations.Select(m => GroupMapper.ToListDto(m.Group, false));
    }

    #endregion

    #region Helper Methods

    private async Task<GroupDto> EnrichGroupDto(Group group, Guid? currentUserId)
    {
        GroupRole? currentUserRole = null;
        MemberStatus? currentUserStatus = null;

        if (currentUserId.HasValue)
        {
            var member = await _memberRepository.FirstOrDefaultAsync(
                m => m.GroupId == group.Id && m.UserId == currentUserId.Value);

            if (member != null)
            {
                currentUserRole = member.Role;
                currentUserStatus = member.Status;
            }
        }

        return GroupMapper.ToDto(group, currentUserRole, currentUserStatus);
    }

    private async Task<bool> IsAdminOrModeratorAsync(Guid groupId, Guid userId)
    {
        var member = await _memberRepository.FirstOrDefaultAsync(
            m => m.GroupId == groupId && m.UserId == userId);

        return member != null && (member.Role == GroupRole.Admin || member.Role == GroupRole.Moderator);
    }

    #endregion
}
