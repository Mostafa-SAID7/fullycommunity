using CommunityCar.API.Controllers.Admin.Dashboard.QA.Models;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers.Admin.Dashboard.QA;

[ApiController]
[Route("api/admin/dashboard/qa/answers")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class QAAnswersAdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<QAAnswersAdminController> _logger;

    public QAAnswersAdminController(AppDbContext context, ILogger<QAAnswersAdminController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAnswer(Guid id, [FromBody] UpdateAnswerAdminRequest request)
    {
        try
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null)
                return NotFound(new { success = false, message = "Answer not found" });

            answer.Content = request.Content;
            answer.IsEdited = true;
            answer.EditedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Answer {Id} updated by admin", id);
            return Ok(new { success = true, message = "Answer updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating answer {Id}", id);
            return StatusCode(500, new { success = false, message = "Error updating answer" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnswer(Guid id)
    {
        try
        {
            var answer = await _context.Answers.FindAsync(id);
            if (answer == null)
                return NotFound(new { success = false, message = "Answer not found" });

            answer.IsDeleted = true;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Answer {Id} deleted by admin", id);
            return Ok(new { success = true, message = "Answer deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting answer {Id}", id);
            return StatusCode(500, new { success = false, message = "Error deleting answer" });
        }
    }
}
