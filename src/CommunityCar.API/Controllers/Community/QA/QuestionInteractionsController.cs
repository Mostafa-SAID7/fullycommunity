using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Domain.Enums.Community.QA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community.QA;

[ApiController]
[Route("api/community/qa/questions")]
[ApiExplorerSettings(GroupName = "community")]
[Produces("application/json")]
public class QuestionInteractionsController : ControllerBase
{
    private readonly IQAService _qaService;
    private readonly ILocalizationService _localization;
    private readonly ILogger<QuestionInteractionsController> _logger;

    public QuestionInteractionsController(
        IQAService qaService,
        ILocalizationService localization,
        ILogger<QuestionInteractionsController> logger)
    {
        _qaService = qaService;
        _localization = localization;
        _logger = logger;
    }

    /// <summary>
    /// Get questions posted by a specific user
    /// </summary>
    [HttpGet("user/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetUserQuestions(
        Guid userId, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        try
        {
            if (userId == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidUserId"),
                    messageAr = _localization.Get("QA.Errors.InvalidUserId", "ar")
                });
            }

            if (page < 1 || pageSize < 1 || pageSize > 100)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidPagination"),
                    messageAr = _localization.Get("QA.Errors.InvalidPagination", "ar")
                });
            }

            var result = await _qaService.GetUserQuestionsAsync(userId, page, pageSize);
            return Ok(new
            {
                success = true,
                data = result,
                message = _localization.Get("QA.Success.UserQuestionsRetrieved"),
                messageAr = _localization.Get("QA.Success.UserQuestionsRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving questions for user: {UserId}", userId);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveQuestionsFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveQuestionsFailed", "ar")
            });
        }
    }

    /// <summary>
    /// /// Get related questions for a specific question
    /// </summary>
    [HttpGet("{id:guid}/related")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetRelatedQuestions(
        Guid id, 
        [FromQuery] int count = 5,
        CancellationToken ct = default)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidQuestionId"),
                    messageAr = _localization.Get("QA.Errors.InvalidQuestionId", "ar")
                });
            }

            if (count < 1 || count > 20)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidCount"),
                    messageAr = _localization.Get("QA.Errors.InvalidCount", "ar")
                });
            }

            var result = await _qaService.GetRelatedQuestionsAsync(id, count);
            return Ok(new
            {
                success = true,
                data = result,
                message = _localization.Get("QA.Success.RelatedQuestionsRetrieved"),
                messageAr = _localization.Get("QA.Success.RelatedQuestionsRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving related questions for: {QuestionId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveQuestionsFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveQuestionsFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Close a question with a reason
    /// </summary>
    [HttpPost("{id:guid}/close")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CloseQuestion(
        Guid id, 
        [FromBody] string reason,
        CancellationToken ct = default)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidQuestionId"),
                    messageAr = _localization.Get("QA.Errors.InvalidQuestionId", "ar")
                });
            }

            if (string.IsNullOrWhiteSpace(reason))
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.CloseReasonRequired"),
                    messageAr = _localization.Get("QA.Errors.CloseReasonRequired", "ar")
                });
            }

            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.Unauthorized"),
                    messageAr = _localization.Get("QA.Errors.Unauthorized", "ar")
                });
            }

            var closed = await _qaService.CloseQuestionAsync(id, userId.Value, reason);
            
            if (!closed)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.CloseQuestionFailed"),
                    messageAr = _localization.Get("QA.Errors.CloseQuestionFailed", "ar")
                });
            }

            _logger.LogInformation("Question closed: {QuestionId} by user {UserId}", id, userId.Value);
            
            return Ok(new
            {
                success = true,
                message = _localization.Get("QA.Success.QuestionClosed"),
                messageAr = _localization.Get("QA.Success.QuestionClosed", "ar")
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to close question {QuestionId}", id);
            return StatusCode(403, new
            {
                success = false,
                message = _localization.Get("QA.Errors.NotQuestionOwner"),
                messageAr = _localization.Get("QA.Errors.NotQuestionOwner", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error closing question: {QuestionId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.CloseQuestionFailed"),
                messageAr = _localization.Get("QA.Errors.CloseQuestionFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Vote on a question (upvote or downvote)
    /// </summary>
    [HttpPost("{id:guid}/vote")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> VoteQuestion(
        Guid id, 
        [FromBody] VoteType type,
        CancellationToken ct = default)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidQuestionId"),
                    messageAr = _localization.Get("QA.Errors.InvalidQuestionId", "ar")
                });
            }

            if (!Enum.IsDefined(typeof(VoteType), type))
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidVoteType"),
                    messageAr = _localization.Get("QA.Errors.InvalidVoteType", "ar")
                });
            }

            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.Unauthorized"),
                    messageAr = _localization.Get("QA.Errors.Unauthorized", "ar")
                });
            }

            var voteCount = await _qaService.VoteQuestionAsync(id, userId.Value, type);
            
            _logger.LogInformation("Question vote recorded: {QuestionId} by user {UserId}, type: {VoteType}", id, userId.Value, type);
            
            return Ok(new
            {
                success = true,
                data = new { voteCount },
                message = _localization.Get("QA.Success.VoteRecorded"),
                messageAr = _localization.Get("QA.Success.VoteRecorded", "ar")
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid vote operation for question {QuestionId}", id);
            return BadRequest(new
            {
                success = false,
                message = _localization.Get("QA.Errors.VoteFailed"),
                messageAr = _localization.Get("QA.Errors.VoteFailed", "ar"),
                errors = new[] { ex.Message }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error voting on question: {QuestionId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.VoteFailed"),
                messageAr = _localization.Get("QA.Errors.VoteFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Bookmark a question
    /// </summary>
    [HttpPost("{id:guid}/bookmark")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> BookmarkQuestion(Guid id, CancellationToken ct = default)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidQuestionId"),
                    messageAr = _localization.Get("QA.Errors.InvalidQuestionId", "ar")
                });
            }

            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.Unauthorized"),
                    messageAr = _localization.Get("QA.Errors.Unauthorized", "ar")
                });
            }

            var bookmarked = await _qaService.BookmarkQuestionAsync(id, userId.Value);
            
            if (!bookmarked)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.BookmarkFailed"),
                    messageAr = _localization.Get("QA.Errors.BookmarkFailed", "ar")
                });
            }

            _logger.LogInformation("Question bookmarked: {QuestionId} by user {UserId}", id, userId.Value);
            
            return Ok(new
            {
                success = true,
                message = _localization.Get("QA.Success.QuestionBookmarked"),
                messageAr = _localization.Get("QA.Success.QuestionBookmarked", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error bookmarking question: {QuestionId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.BookmarkFailed"),
                messageAr = _localization.Get("QA.Errors.BookmarkFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Remove bookmark from a question
    /// </summary>
    [HttpDelete("{id:guid}/bookmark")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UnbookmarkQuestion(Guid id, CancellationToken ct = default)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidQuestionId"),
                    messageAr = _localization.Get("QA.Errors.InvalidQuestionId", "ar")
                });
            }

            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.Unauthorized"),
                    messageAr = _localization.Get("QA.Errors.Unauthorized", "ar")
                });
            }

            var unbookmarked = await _qaService.UnbookmarkQuestionAsync(id, userId.Value);
            
            if (!unbookmarked)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.UnbookmarkFailed"),
                    messageAr = _localization.Get("QA.Errors.UnbookmarkFailed", "ar")
                });
            }

            _logger.LogInformation("Question unbookmarked: {QuestionId} by user {UserId}", id, userId.Value);
            
            return Ok(new
            {
                success = true,
                message = _localization.Get("QA.Success.QuestionUnbookmarked"),
                messageAr = _localization.Get("QA.Success.QuestionUnbookmarked", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unbookmarking question: {QuestionId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.UnbookmarkFailed"),
                messageAr = _localization.Get("QA.Errors.UnbookmarkFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Get user's bookmarked questions
    /// </summary>
    [HttpGet("bookmarks")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetBookmarks(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        try
        {
            if (page < 1 || pageSize < 1 || pageSize > 100)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidPagination"),
                    messageAr = _localization.Get("QA.Errors.InvalidPagination", "ar")
                });
            }

            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.Unauthorized"),
                    messageAr = _localization.Get("QA.Errors.Unauthorized", "ar")
                });
            }

            var bookmarks = await _qaService.GetUserBookmarksAsync(userId.Value, page, pageSize);
            
            return Ok(new
            {
                success = true,
                data = bookmarks,
                message = _localization.Get("QA.Success.BookmarksRetrieved"),
                messageAr = _localization.Get("QA.Success.BookmarksRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bookmarks for user: {UserId}", GetUserId());
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveBookmarksFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveBookmarksFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Get all question categories
    /// </summary>
    [HttpGet("categories")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetCategories(CancellationToken ct = default)
    {
        try
        {
            var categories = await _qaService.GetCategoriesAsync();
            
            return Ok(new
            {
                success = true,
                data = categories,
                message = _localization.Get("QA.Success.CategoriesRetrieved"),
                messageAr = _localization.Get("QA.Success.CategoriesRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving question categories");
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveCategoriesFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveCategoriesFailed", "ar")
            });
        }
    }

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}
