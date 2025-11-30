using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Storage;

namespace CommunityCar.API.Controllers.Common;

[ApiController]
[Route("api/files")]
[ApiExplorerSettings(GroupName = "pages")]
public class FilesController : ControllerBase
{
    private readonly IFileStorageService _storage;

    public FilesController(IFileStorageService storage) => _storage = storage;

    [HttpPost("upload")]
    [Authorize]
    public async Task<IActionResult> Upload(
        IFormFile file,
        [FromQuery] FileCategory category,
        [FromQuery] Guid? entityId = null,
        [FromQuery] string? entityType = null,
        CancellationToken ct = default)
    {
        try
        {
            var storedFile = await _storage.UploadAsync(file, category, entityId, entityType, ct);
            return Ok(new
            {
                storedFile.Id,
                storedFile.FileName,
                storedFile.OriginalFileName,
                storedFile.ContentType,
                storedFile.SizeBytes,
                Url = _storage.GetUrl(storedFile)
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("upload/multiple")]
    [Authorize]
    public async Task<IActionResult> UploadMultiple(
        List<IFormFile> files,
        [FromQuery] FileCategory category,
        [FromQuery] Guid? entityId = null,
        [FromQuery] string? entityType = null,
        CancellationToken ct = default)
    {
        try
        {
            var storedFiles = await _storage.UploadMultipleAsync(files, category, entityId, entityType, ct);
            return Ok(storedFiles.Select(f => new
            {
                f.Id,
                f.FileName,
                f.OriginalFileName,
                f.ContentType,
                f.SizeBytes,
                Url = _storage.GetUrl(f)
            }));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetFile(Guid id, CancellationToken ct)
    {
        var file = await _storage.GetByIdAsync(id, ct);
        if (file == null) return NotFound();

        return Ok(new
        {
            file.Id,
            file.FileName,
            file.OriginalFileName,
            file.ContentType,
            file.SizeBytes,
            file.Width,
            file.Height,
            Url = _storage.GetUrl(file)
        });
    }

    [HttpGet("{id}/download")]
    public async Task<IActionResult> Download(Guid id, CancellationToken ct)
    {
        var file = await _storage.GetByIdAsync(id, ct);
        if (file == null) return NotFound();

        var stream = await _storage.GetStreamAsync(id, ct);
        if (stream == null) return NotFound();

        return File(stream, file.ContentType, file.OriginalFileName);
    }

    [HttpGet("entity/{entityType}/{entityId}")]
    public async Task<IActionResult> GetByEntity(string entityType, Guid entityId, CancellationToken ct)
    {
        var files = await _storage.GetByEntityAsync(entityType, entityId, ct);
        return Ok(files.Select(f => new
        {
            f.Id,
            f.FileName,
            f.OriginalFileName,
            f.ContentType,
            f.SizeBytes,
            Url = _storage.GetUrl(f)
        }));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await _storage.DeleteAsync(id, ct);
        if (!result) return NotFound();
        return NoContent();
    }
}
