using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Features.Community.Groups.DTOs;
using CommunityCar.Domain.Entities.Community.Groups;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/groups")]
public class GroupsController : ControllerBase
{
    private readonly IGroupService _groupService;

    public GroupsController(IGroupService groupService) => _groupService = groupService;

    [HttpGet]
    public async Task<IActionResult> GetGroups([FromQuery] GroupFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _groupService.GetGroupsAsync(filter, page, pageSize));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var group = await _groupService.GetByIdAsync(id, GetUserId());
        return group is null ? NotFound() : Ok(group);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var group = await _groupService.GetBySlugAsync(slug, GetUserId());
        return group is null ? NotFound() : Ok(group);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetUserGroups(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _groupService.GetUserGroupsAsync(userId, page, pageSize));

    [HttpGet("suggested")]
    [Authorize]
    public async Task<IActionResult> GetSuggestedGroups([FromQuery] int count = 10)
        => Ok(await _groupService.GetSuggestedGroupsAsync(GetUserId()!.Value, count));

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateGroupRequest request)
    {
        var group = await _groupService.CreateAsync(GetUserId()!.Value, request);
        return CreatedAtAction(nameof(GetById), new { id = group.Id }, group);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, UpdateGroupRequest request)
        => Ok(await _groupService.UpdateAsync(id, GetUserId()!.Value, request));

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
        => await _groupService.DeleteAsync(id, GetUserId()!.Value) ? NoContent() : NotFound();

    // Membership
    [HttpPost("{id:guid}/join")]
    [Authorize]
    public async Task<IActionResult> Join(Guid id, JoinGroupRequest? request = null)
        => await _groupService.JoinAsync(id, GetUserId()!.Value, request) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/leave")]
    [Authorize]
    public async Task<IActionResult> Leave(Guid id)
        => await _groupService.LeaveAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpGet("{id:guid}/members")]
    public async Task<IActionResult> GetMembers(Guid id, [FromQuery] MemberStatus? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _groupService.GetMembersAsync(id, status, page, pageSize));

    [HttpPost("{id:guid}/members/{memberId:guid}/approve")]
    [Authorize]
    public async Task<IActionResult> ApproveMember(Guid id, Guid memberId)
        => await _groupService.ApproveMemberAsync(id, memberId, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/members/{memberId:guid}/reject")]
    [Authorize]
    public async Task<IActionResult> RejectMember(Guid id, Guid memberId)
        => await _groupService.RejectMemberAsync(id, memberId, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpDelete("{id:guid}/members/{memberId:guid}")]
    [Authorize]
    public async Task<IActionResult> RemoveMember(Guid id, Guid memberId)
        => await _groupService.RemoveMemberAsync(id, memberId, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/members/{memberId:guid}/ban")]
    [Authorize]
    public async Task<IActionResult> BanMember(Guid id, Guid memberId, [FromBody] string? reason = null)
        => await _groupService.BanMemberAsync(id, memberId, GetUserId()!.Value, reason) ? Ok() : BadRequest();

    [HttpPut("{id:guid}/members/{memberId:guid}/role")]
    [Authorize]
    public async Task<IActionResult> UpdateMemberRole(Guid id, Guid memberId, UpdateMemberRoleRequest request)
        => await _groupService.UpdateMemberRoleAsync(id, memberId, GetUserId()!.Value, request) ? Ok() : BadRequest();

    [HttpPost("{id:guid}/invite/{inviteeId:guid}")]
    [Authorize]
    public async Task<IActionResult> InviteUser(Guid id, Guid inviteeId)
        => await _groupService.InviteUserAsync(id, GetUserId()!.Value, inviteeId) ? Ok() : BadRequest();

    [HttpGet("invitations")]
    [Authorize]
    public async Task<IActionResult> GetPendingInvitations()
        => Ok(await _groupService.GetPendingInvitationsAsync(GetUserId()!.Value));

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}
