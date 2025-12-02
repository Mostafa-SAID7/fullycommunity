using CommunityCar.Domain.Entities.Community.Groups;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/groups")]
[ApiExplorerSettings(GroupName = "community")]
public class GroupsController : ControllerBase
{
    private readonly AppDbContext _context;

    public GroupsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetGroups([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Groups.AsQueryable();
        
        if (!string.IsNullOrEmpty(search))
            query = query.Where(g => g.Name.Contains(search) || g.Description.Contains(search));

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(g => g.MemberCount)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => new GroupDto(g.Id, g.Name, g.Description, g.CoverImageUrl, g.MemberCount, g.Privacy.ToString(), g.CreatedAt))
            .ToListAsync();

        return Ok(new { items, totalCount = total, page, pageSize });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var group = await _context.Groups
            .Where(g => g.Id == id)
            .Select(g => new GroupDto(g.Id, g.Name, g.Description, g.CoverImageUrl, g.MemberCount, g.Privacy.ToString(), g.CreatedAt))
            .FirstOrDefaultAsync();

        return group is null ? NotFound() : Ok(group);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyGroups()
    {
        var userId = GetUserId();
        var groups = await _context.Set<GroupMember>()
            .Where(m => m.UserId == userId)
            .Include(m => m.Group)
            .Select(m => new GroupDto(m.Group.Id, m.Group.Name, m.Group.Description, m.Group.CoverImageUrl, m.Group.MemberCount, m.Group.Privacy.ToString(), m.Group.CreatedAt))
            .ToListAsync();

        return Ok(groups);
    }

    [HttpPost("{id:guid}/join")]
    [Authorize]
    public async Task<IActionResult> JoinGroup(Guid id)
    {
        var userId = GetUserId();
        var exists = await _context.Set<GroupMember>().AnyAsync(m => m.GroupId == id && m.UserId == userId);
        if (exists) return BadRequest("Already a member");

        _context.Set<GroupMember>().Add(new GroupMember { GroupId = id, UserId = userId, Role = GroupRole.Member });
        
        var group = await _context.Groups.FindAsync(id);
        if (group != null) group.MemberCount++;
        
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id:guid}/leave")]
    [Authorize]
    public async Task<IActionResult> LeaveGroup(Guid id)
    {
        var userId = GetUserId();
        var member = await _context.Set<GroupMember>().FirstOrDefaultAsync(m => m.GroupId == id && m.UserId == userId);
        if (member == null) return NotFound();

        _context.Set<GroupMember>().Remove(member);
        
        var group = await _context.Groups.FindAsync(id);
        if (group != null && group.MemberCount > 0) group.MemberCount--;
        
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

public record GroupDto(Guid Id, string Name, string Description, string? CoverImageUrl, int MemberCount, string Privacy, DateTime CreatedAt);
