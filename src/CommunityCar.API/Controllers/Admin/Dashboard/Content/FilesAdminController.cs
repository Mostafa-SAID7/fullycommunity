using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Storage;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.Settings;

[ApiController]
[Route("api/admin/files")]
[Authorize(Roles = "SuperAdmin,SettingsAdmin")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class FilesAdminController : ControllerBase
{
    private readonly IAppDbContext _context;
    private readonly IFileStorageService _storage;

    public FilesAdminController(IAppDbContext context, IFileStorageService storage)
    {
        _context = context;
        _storage = storage;
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles(
        [FromQuery] FileCategory? category = null,
        [FromQuery] string? entityType = null,
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken ct = default)
    {
        var query = _context.Set<StoredFile>().AsQueryable();

        if (category.HasValue)
            query = query.Where(f => f.Category == category.Value);
        if (!string.IsNullOrEmpty(entityType))
            query = query.Where(f => f.EntityType == entityType);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(f => f.OriginalFileName.Contains(search) || f.FileName.Contains(search));

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(f => f.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(f => new
            {
                f.Id,
                f.FileName,
                f.OriginalFileName,
                f.ContentType,
                f.SizeBytes,
                f.Category,
                f.EntityType,
                f.EntityId,
                f.Url,
                f.CreatedAt
            })
            .ToListAsync(ct);

        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken ct)
    {
        var totalFiles = await _context.Set<StoredFile>().CountAsync(ct);
        var totalSize = await _context.Set<StoredFile>().SumAsync(f => f.SizeBytes, ct);
        var byCategory = await _context.Set<StoredFile>()
            .GroupBy(f => f.Category)
            .Select(g => new { Category = g.Key, Count = g.Count(), Size = g.Sum(f => f.SizeBytes) })
            .ToListAsync(ct);

        return Ok(new
        {
            TotalFiles = totalFiles,
            TotalSizeBytes = totalSize,
            TotalSizeMB = totalSize / 1024.0 / 1024.0,
            ByCategory = byCategory
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFile(Guid id, CancellationToken ct)
    {
        var result = await _storage.DeleteAsync(id, ct);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpDelete("bulk")]
    public async Task<IActionResult> BulkDelete([FromBody] List<Guid> ids, CancellationToken ct)
    {
        var deleted = 0;
        foreach (var id in ids)
        {
            if (await _storage.DeleteAsync(id, ct))
                deleted++;
        }
        return Ok(new { deleted, total = ids.Count });
    }

    [HttpDelete("orphaned")]
    public async Task<IActionResult> DeleteOrphanedFiles(CancellationToken ct)
    {
        // Delete files that have no associated entity
        var orphaned = await _context.Set<StoredFile>()
            .Where(f => f.EntityId == null && f.CreatedAt < DateTime.UtcNow.AddDays(-7))
            .ToListAsync(ct);

        foreach (var file in orphaned)
        {
            await _storage.DeleteAsync(file.Id, ct);
        }

        return Ok(new { deleted = orphaned.Count });
    }
}

