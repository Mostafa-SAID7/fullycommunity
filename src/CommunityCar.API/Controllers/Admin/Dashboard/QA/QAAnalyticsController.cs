using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Admin.Dashboard.QA;

[ApiController]
[Route("api/admin/dashboard/qa/analytics")]
[Authorize(Policy = "AdminOnly")]
[ApiExplorerSettings(GroupName = "dashboard")]
public class QAAnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<QAAnalyticsController> _logger;

    public QAAnalyticsController(AppDbContext context, ILogger<QAAnalyticsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("trends")]
    public async Task<IActionResult> GetTrends([FromQuery] int days = 30)
    {
        try
        {
            var startDate = DateTime.UtcNow.AddDays(-days);

            var dailyStats = await _context.Questions
                .Where(q => !q.IsDeleted && q.CreatedAt >= startDate)
                .GroupBy(q => q.CreatedAt.Date)
                .Select(g => new
                {
                    date = g.Key,
                    questions = g.Count(),
                    answers = g.Sum(q => q.AnswerCount)
                })
                .OrderBy(s => s.date)
                .ToListAsync();

            var topTags = await _context.QuestionTags
                .Where(qt => qt.Question.CreatedAt >= startDate && !qt.Question.IsDeleted)
                .GroupBy(qt => qt.Tag)
                .Select(g => new { tag = g.Key, count = g.Count() })
                .OrderByDescending(t => t.count)
                .Take(10)
                .ToListAsync();

            var topCategories = await _context.Questions
                .Where(q => !q.IsDeleted && q.CreatedAt >= startDate && q.CategoryId != null)
                .GroupBy(q => q.Category!.Name)
                .Select(g => new { category = g.Key, count = g.Count() })
                .OrderByDescending(c => c.count)
                .Take(10)
                .ToListAsync();

            return Ok(new { success = true, data = new { dailyStats, topTags, topCategories } });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting trends");
            return StatusCode(500, new { success = false, message = "Error retrieving trends" });
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUserStats()
    {
        try
        {
            var topContributors = await _context.Questions
                .Where(q => !q.IsDeleted)
                .GroupBy(q => new
                {
                    q.AuthorId,
                    q.Author.FirstName,
                    q.Author.LastName,
                    q.Author.Email
                })
                .Select(g => new
                {
                    userId = g.Key.AuthorId,
                    name = $"{g.Key.FirstName} {g.Key.LastName}",
                    email = g.Key.Email,
                    questionCount = g.Count(),
                    totalVotes = g.Sum(q => q.VoteCount),
                    totalViews = g.Sum(q => q.ViewCount)
                })
                .OrderByDescending(u => u.questionCount)
                .Take(20)
                .ToListAsync();

            var topAnswerers = await _context.Answers
                .Where(a => !a.IsDeleted)
                .GroupBy(a => new
                {
                    a.AuthorId,
                    a.Author.FirstName,
                    a.Author.LastName,
                    a.Author.Email
                })
                .Select(g => new
                {
                    userId = g.Key.AuthorId,
                    name = $"{g.Key.FirstName} {g.Key.LastName}",
                    email = g.Key.Email,
                    answerCount = g.Count(),
                    acceptedCount = g.Count(a => a.IsAccepted),
                    totalVotes = g.Sum(a => a.VoteCount)
                })
                .OrderByDescending(u => u.answerCount)
                .Take(20)
                .ToListAsync();

            return Ok(new { success = true, data = new { topContributors, topAnswerers } });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user stats");
            return StatusCode(500, new { success = false, message = "Error retrieving user stats" });
        }
    }
}
