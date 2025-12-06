using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Features.Community.QA.DTOs;
using CommunityCar.Domain.Entities.Community.QA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/qa")]
[ApiExplorerSettings(GroupName = "community")]
public class QAController : ControllerBase
{
    private readonly IQAService _qaService;

    public QAController(IQAService qaService) => _qaService = qaService;

    // Questions
    [HttpGet("questions")]
    public async Task<IActionResult> GetQuestions([FromQuery] QuestionFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _qaService.GetQuestionsAsync(filter, page, pageSize));

    [HttpGet("questions/{id:guid}")]
    public async Task<IActionResult> GetQuestion(Guid id)
    {
        var question = await _qaService.GetQuestionByIdAsync(id, GetUserId());
        return question is null ? NotFound() : Ok(question);
    }

    [HttpGet("questions/slug/{slug}")]
    public async Task<IActionResult> GetQuestionBySlug(string slug)
    {
        var question = await _qaService.GetQuestionBySlugAsync(slug, GetUserId());
        return question is null ? NotFound() : Ok(question);
    }

    [HttpGet("questions/user/{userId:guid}")]
    public async Task<IActionResult> GetUserQuestions(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _qaService.GetUserQuestionsAsync(userId, page, pageSize));

    [HttpGet("questions/{id:guid}/related")]
    public async Task<IActionResult> GetRelatedQuestions(Guid id, [FromQuery] int count = 5)
        => Ok(await _qaService.GetRelatedQuestionsAsync(id, count));

    [HttpPost("questions")]
    [Authorize]
    public async Task<IActionResult> CreateQuestion(CreateQuestionRequest request)
    {
        var question = await _qaService.CreateQuestionAsync(GetUserId()!.Value, request);
        return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
    }

    [HttpPut("questions/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateQuestion(Guid id, UpdateQuestionRequest request)
        => Ok(await _qaService.UpdateQuestionAsync(id, GetUserId()!.Value, request));

    [HttpDelete("questions/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteQuestion(Guid id)
        => await _qaService.DeleteQuestionAsync(id, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpPost("questions/{id:guid}/close")]
    [Authorize]
    public async Task<IActionResult> CloseQuestion(Guid id, [FromBody] string reason)
        => await _qaService.CloseQuestionAsync(id, GetUserId()!.Value, reason) ? Ok() : BadRequest();

    [HttpPost("questions/{id:guid}/vote")]
    [Authorize]
    public async Task<IActionResult> VoteQuestion(Guid id, [FromBody] VoteType type)
        => Ok(new { voteCount = await _qaService.VoteQuestionAsync(id, GetUserId()!.Value, type) });

    [HttpPost("questions/{id:guid}/bookmark")]
    [Authorize]
    public async Task<IActionResult> BookmarkQuestion(Guid id)
        => await _qaService.BookmarkQuestionAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpDelete("questions/{id:guid}/bookmark")]
    [Authorize]
    public async Task<IActionResult> UnbookmarkQuestion(Guid id)
        => await _qaService.UnbookmarkQuestionAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    // Answers
    [HttpGet("questions/{questionId:guid}/answers")]
    public async Task<IActionResult> GetAnswers(Guid questionId)
        => Ok(await _qaService.GetAnswersAsync(questionId, GetUserId()));

    [HttpPost("questions/{questionId:guid}/answers")]
    [Authorize]
    public async Task<IActionResult> CreateAnswer(Guid questionId, CreateAnswerRequest request)
        => Ok(await _qaService.CreateAnswerAsync(questionId, GetUserId()!.Value, request));

    [HttpPut("answers/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateAnswer(Guid id, UpdateAnswerRequest request)
        => Ok(await _qaService.UpdateAnswerAsync(id, GetUserId()!.Value, request));

    [HttpDelete("answers/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteAnswer(Guid id)
        => await _qaService.DeleteAnswerAsync(id, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpPost("answers/{id:guid}/accept")]
    [Authorize]
    public async Task<IActionResult> AcceptAnswer(Guid id)
        => await _qaService.AcceptAnswerAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("answers/{id:guid}/vote")]
    [Authorize]
    public async Task<IActionResult> VoteAnswer(Guid id, [FromBody] VoteType type)
        => Ok(new { voteCount = await _qaService.VoteAnswerAsync(id, GetUserId()!.Value, type) });

    // Categories & Bookmarks
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
        => Ok(await _qaService.GetCategoriesAsync());

    [HttpGet("bookmarks")]
    [Authorize]
    public async Task<IActionResult> GetBookmarks([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _qaService.GetUserBookmarksAsync(GetUserId()!.Value, page, pageSize));

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}
