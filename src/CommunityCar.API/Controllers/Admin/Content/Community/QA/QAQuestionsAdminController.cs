using CommunityCar.API.Controllers.Admin.Dashboard.QA.Models;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.QA;

[ApiController]
[Route("api/admin/dashboard/qa/questions")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class QAQuestionsAdminController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<QAQuestionsAdminController> _logger;

    public QAQuestionsAdminController(AppDbContext context, ILogger<QAQuestionsAdminController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetQuestions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? search = null)
    {
        try
        {
            var query = _context.Questions
                .Include(q => q.Author)
                .Include(q => q.Category)
                .Where(q => !q.IsDeleted);

            if (!string.IsNullOrEmpty(status))
            {
                if (Enum.TryParse<Domain.Enums.Community.QA.QuestionStatus>(status, true, out var statusEnum))
                {
                    query = query.Where(q => q.Status == statusEnum);
                }
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(q => q.Title.Contains(search) || q.Content.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var questions = await query
                .OrderByDescending(q => q.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(q => new
                {
                    id = q.Id,
                    title = q.Title,
                    content = q.Content.Substring(0, Math.Min(200, q.Content.Length)),
                    status = q.Status.ToString(),
                    categoryId = q.CategoryId,
                    categoryName = q.Category != null ? q.Category.Name : null,
                    authorId = q.AuthorId,
                    authorName = q.Author != null
                        ? $"{q.Author.FirstName} {q.Author.LastName}"
                        : "Unknown",
                    authorEmail = q.Author != null ? q.Author.Email : null,
                    voteCount = q.VoteCount,
                    answerCount = q.AnswerCount,
                    viewCount = q.ViewCount,
                    hasAcceptedAnswer = q.AcceptedAnswerId != null,
                    createdAt = q.CreatedAt,
                    updatedAt = q.UpdatedAt,
                    tags = q.Tags.Select(t => t.Tag).ToList()
                })
                .ToListAsync();

            return Ok(
                new
                {
                    success = true,
                    data = new
                    {
                        items = questions,
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
            _logger.LogError(ex, "Error getting questions");
            return StatusCode(500, new { success = false, message = "Error retrieving questions" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuestion(Guid id)
    {
        try
        {
            var question = await _context.Questions
                .Include(q => q.Author)
                .Include(q => q.Category)
                .Include(q => q.Tags)
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id && !q.IsDeleted);

            if (question == null)
                return NotFound(new { success = false, message = "Question not found" });

            var result = new
            {
                id = question.Id,
                title = question.Title,
                content = question.Content,
                status = question.Status.ToString(),
                categoryId = question.CategoryId,
                categoryName = question.Category?.Name,
                authorId = question.AuthorId,
                authorName = question.Author != null
                    ? $"{question.Author.FirstName} {question.Author.LastName}"
                    : "Unknown",
                authorEmail = question.Author?.Email,
                voteCount = question.VoteCount,
                answerCount = question.AnswerCount,
                viewCount = question.ViewCount,
                hasAcceptedAnswer = question.AcceptedAnswerId != null,
                createdAt = question.CreatedAt,
                updatedAt = question.UpdatedAt,
                tags = question.Tags.Select(t => t.Tag).ToList(),
                answers = question.Answers
                    .Where(a => !a.IsDeleted)
                    .Select(a => new
                    {
                        id = a.Id,
                        content = a.Content.Substring(0, Math.Min(200, a.Content.Length)),
                        isAccepted = a.IsAccepted,
                        voteCount = a.VoteCount,
                        createdAt = a.CreatedAt
                    })
                    .ToList()
            };

            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting question {Id}", id);
            return StatusCode(500, new { success = false, message = "Error retrieving question" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuestion(Guid id, [FromBody] UpdateQuestionAdminRequest request)
    {
        try
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { success = false, message = "Question not found" });

            question.Title = request.Title;
            question.Content = request.Content;
            question.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Question {Id} updated by admin", id);
            return Ok(new { success = true, message = "Question updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating question {Id}", id);
            return StatusCode(500, new { success = false, message = "Error updating question" });
        }
    }

    [HttpPost("{id}/close")]
    public async Task<IActionResult> CloseQuestion(Guid id, [FromBody] CloseQuestionRequest request)
    {
        try
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { success = false, message = "Question not found" });

            question.Status = Domain.Enums.Community.QA.QuestionStatus.Closed;
            question.IsClosed = true;
            question.CloseReason = request.Reason;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Question {Id} closed by admin: {Reason}", id, request.Reason);
            return Ok(new { success = true, message = "Question closed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error closing question {Id}", id);
            return StatusCode(500, new { success = false, message = "Error closing question" });
        }
    }

    [HttpPost("{id}/reopen")]
    public async Task<IActionResult> ReopenQuestion(Guid id)
    {
        try
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { success = false, message = "Question not found" });

            question.Status = Domain.Enums.Community.QA.QuestionStatus.Open;
            question.IsClosed = false;
            question.CloseReason = null;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Question {Id} reopened by admin", id);
            return Ok(new { success = true, message = "Question reopened successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reopening question {Id}", id);
            return StatusCode(500, new { success = false, message = "Error reopening question" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuestion(Guid id)
    {
        try
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return NotFound(new { success = false, message = "Question not found" });

            question.IsDeleted = true;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Question {Id} deleted by admin", id);
            return Ok(new { success = true, message = "Question deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting question {Id}", id);
            return StatusCode(500, new { success = false, message = "Error deleting question" });
        }
    }
}
