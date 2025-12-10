using CommunityCar.API.Controllers.Admin.Dashboard.QA.Models;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.QA;

[ApiController]
[Route("api/admin/dashboard/qa/bulk")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class QABulkActionsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<QABulkActionsController> _logger;

    public QABulkActionsController(AppDbContext context, ILogger<QABulkActionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("close")]
    public async Task<IActionResult> BulkCloseQuestions([FromBody] BulkActionRequest request)
    {
        try
        {
            var questions = await _context.Questions
                .Where(q => request.QuestionIds.Contains(q.Id))
                .ToListAsync();

            foreach (var question in questions)
            {
                question.Status = Domain.Enums.Community.QA.QuestionStatus.Closed;
                question.IsClosed = true;
                question.CloseReason = request.Reason;
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Bulk closed {Count} questions", questions.Count);
            return Ok(
                new { success = true, message = $"Closed {questions.Count} questions successfully" }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error bulk closing questions");
            return StatusCode(500, new { success = false, message = "Error closing questions" });
        }
    }

    [HttpPost("delete")]
    public async Task<IActionResult> BulkDeleteQuestions([FromBody] BulkDeleteRequest request)
    {
        try
        {
            var questions = await _context.Questions
                .Where(q => request.QuestionIds.Contains(q.Id))
                .ToListAsync();

            foreach (var question in questions)
            {
                question.IsDeleted = true;
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Bulk deleted {Count} questions", questions.Count);
            return Ok(
                new { success = true, message = $"Deleted {questions.Count} questions successfully" }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error bulk deleting questions");
            return StatusCode(500, new { success = false, message = "Error deleting questions" });
        }
    }
}
