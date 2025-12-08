using CommunityCar.API.Controllers.Admin.Dashboard.QA.Models;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.QA;

[ApiController]
[Route("api/admin/dashboard/qa/tags")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class QATagsAdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<QATagsAdminController> _logger;

    public QATagsAdminController(AppDbContext context, ILogger<QATagsAdminController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetTags([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        try
        {
            var tagsQuery = _context.QuestionTags
                .GroupBy(qt => qt.Tag)
                .Select(g => new
                {
                    tag = g.Key,
                    count = g.Count(),
                    lastUsed = g.Max(qt => qt.Question.CreatedAt)
                })
                .OrderByDescending(t => t.count);

            var totalCount = await tagsQuery.CountAsync();
            var tags = await tagsQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(
                new
                {
                    success = true,
                    data = new
                    {
                        items = tags,
                        totalCount,
                        page,
                        pageSize,
                        totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                    }
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting tags");
            return StatusCode(500, new { success = false, message = "Error retrieving tags" });
        }
    }

    [HttpPost("merge")]
    public async Task<IActionResult> MergeTags([FromBody] MergeTagsRequest request)
    {
        try
        {
            var tagsToMerge = await _context.QuestionTags
                .Where(qt => request.SourceTags.Contains(qt.Tag))
                .ToListAsync();

            foreach (var tag in tagsToMerge)
            {
                tag.Tag = request.TargetTag;
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Merged tags {SourceTags} into {TargetTag}",
                string.Join(", ", request.SourceTags),
                request.TargetTag
            );

            return Ok(
                new { success = true, message = $"Merged {tagsToMerge.Count} tags successfully" }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error merging tags");
            return StatusCode(500, new { success = false, message = "Error merging tags" });
        }
    }

    [HttpDelete("{tag}")]
    public async Task<IActionResult> DeleteTag(string tag)
    {
        try
        {
            var tagsToDelete = await _context.QuestionTags.Where(qt => qt.Tag == tag).ToListAsync();

            _context.QuestionTags.RemoveRange(tagsToDelete);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted tag {Tag} ({Count} occurrences)", tag, tagsToDelete.Count);
            return Ok(new { success = true, message = $"Deleted tag '{tag}' successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting tag {Tag}", tag);
            return StatusCode(500, new { success = false, message = "Error deleting tag" });
        }
    }
}
