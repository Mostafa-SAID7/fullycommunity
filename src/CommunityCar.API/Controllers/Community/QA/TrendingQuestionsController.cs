using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.API.Controllers.Community.QA;

[ApiController]
[Route("api/community/trending-questions")]
[ApiExplorerSettings(GroupName = "community")]
public class TrendingQuestionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TrendingQuestionsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetTrendingQuestions()
    {
        var trendingQuestions = await _context.Questions
            .Include(q => q.Author)
            .Include(q => q.Tags)
            .Where(q => !q.IsDeleted && q.Status != QuestionStatus.Closed)
            .OrderByDescending(q => q.VoteCount)
            .ThenByDescending(q => q.ViewCount)
            .ThenByDescending(q => q.CreatedAt)
            .Take(5)
            .Select(q => new TrendingQuestionDto(
                q.Id,
                q.Title,
                q.Slug ?? q.Id.ToString(),
                q.Content.Length > 200 ? q.Content.Substring(0, 200) + "..." : q.Content,
                new QuestionAuthorDto(
                    q.Author.Id,
                    q.Author.FirstName ?? "",
                    q.Author.LastName ?? "",
                    q.Author.AvatarUrl,
                    q.Author.UserType.ToString()
                ),
                q.VoteCount,
                q.AnswerCount,
                q.ViewCount,
                q.AcceptedAnswerId != null,
                q.Tags.Select(t => t.Tag).ToList(),
                q.CreatedAt
            ))
            .ToListAsync();

        return Ok(trendingQuestions);
    }

    [HttpPost("{id:guid}/vote")]
    public async Task<IActionResult> VoteQuestion(Guid id, [FromBody] VoteRequest request)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question == null) return NotFound();

        // Here you would implement voting logic
        // For now, just increment vote count
        question.VoteCount += request.Type == "up" ? 1 : -1;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("{id:guid}/bookmark")]
    public async Task<IActionResult> BookmarkQuestion(Guid id)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question == null) return NotFound();

        question.BookmarkCount++;
        await _context.SaveChangesAsync();

        return Ok();
    }
}