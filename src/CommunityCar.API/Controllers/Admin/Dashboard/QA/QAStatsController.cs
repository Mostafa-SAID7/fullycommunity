using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.QA;

[ApiController]
[Route("api/admin/dashboard/qa/stats")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class QAStatsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<QAStatsController> _logger;

    public QAStatsController(AppDbContext context, ILogger<QAStatsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetQAStats()
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var weekAgo = DateTime.UtcNow.AddDays(-7);

            var stats = new
            {
                totalQuestions = await _context.Questions.CountAsync(q => !q.IsDeleted),
                totalAnswers = await _context.Answers.CountAsync(a => !a.IsDeleted),
                openQuestions = await _context.Questions.CountAsync(
                    q => !q.IsDeleted && q.Status == Domain.Enums.Community.QA.QuestionStatus.Open
                ),
                answeredQuestions = await _context.Questions.CountAsync(
                    q => !q.IsDeleted && q.AcceptedAnswerId != null
                ),
                closedQuestions = await _context.Questions.CountAsync(
                    q => !q.IsDeleted && q.Status == Domain.Enums.Community.QA.QuestionStatus.Closed
                ),
                questionsToday = await _context.Questions.CountAsync(
                    q => !q.IsDeleted && q.CreatedAt >= today
                ),
                questionsThisWeek = await _context.Questions.CountAsync(
                    q => !q.IsDeleted && q.CreatedAt >= weekAgo
                ),
                answersToday = await _context.Answers.CountAsync(
                    a => !a.IsDeleted && a.CreatedAt >= today
                ),
                answersThisWeek = await _context.Answers.CountAsync(
                    a => !a.IsDeleted && a.CreatedAt >= weekAgo
                ),
                totalCategories = await _context.QuestionCategories.CountAsync(),
                totalVotes = await _context.QuestionVotes.CountAsync()
            };

            return Ok(new { success = true, data = stats });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting Q&A stats");
            return StatusCode(500, new { success = false, message = "Error retrieving Q&A stats" });
        }
    }
}
