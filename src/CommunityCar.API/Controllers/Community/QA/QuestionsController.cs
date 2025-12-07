using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.DTOs.Response.Community.QA;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community.QA;

[ApiController]
[Route("api/community/qa/questions")]
[ApiExplorerSettings(GroupName = "community")]
[Produces("application/json")]
public class QuestionsController : ControllerBase
{
    private readonly IQAService _qaService;
    private readonly ILocalizationService _localization;
    private readonly ILogger<QuestionsController> _logger;

    public QuestionsController(
        IQAService qaService,
        ILocalizationService localization,
        ILogger<QuestionsController> logger)
    {
        _qaService = qaService;
        _localization = localization;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated list of questions with optional filters
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetQuestions(
        [FromQuery] QuestionFilter filter, 
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
                    messageAr = _localization.Get("QA.Errors.InvalidPagination", "ar"),
                    errors = new[] { "Page must be >= 1 and PageSize must be between 1 and 100" }
                });
            }

            var result = await _qaService.GetQuestionsAsync(filter, page, pageSize);
            return Ok(new
            {
                success = true,
                data = result,
                message = _localization.Get("QA.Success.QuestionsRetrieved"),
                messageAr = _localization.Get("QA.Success.QuestionsRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving questions with filter: {@Filter}", filter);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveQuestionsFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveQuestionsFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Get a specific question by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetQuestion(Guid id, CancellationToken ct = default)
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

            // Record unique view (one per user)
            var userId = GetUserId();
            var anonymousId = GetAnonymousId();
            await _qaService.RecordViewAsync(id, userId, anonymousId);

            var question = await _qaService.GetQuestionByIdAsync(id, userId);
            
            if (question is null)
            {
                return NotFound(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.QuestionNotFound"),
                    messageAr = _localization.Get("QA.Errors.QuestionNotFound", "ar")
                });
            }

            return Ok(new
            {
                success = true,
                data = question,
                message = _localization.Get("QA.Success.QuestionRetrieved"),
                messageAr = _localization.Get("QA.Success.QuestionRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving question with ID: {QuestionId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveQuestionFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveQuestionFailed", "ar")
            });
        }
    }

    /// <summary>
    /// /// Get a specific question by slug
    /// </summary>
    [HttpGet("slug/{slug}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetQuestionBySlug(string slug, CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(slug))
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidSlug"),
                    messageAr = _localization.Get("QA.Errors.InvalidSlug", "ar")
                });
            }

            var question = await _qaService.GetQuestionBySlugAsync(slug, GetUserId());
            
            if (question is null)
            {
                return NotFound(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.QuestionNotFound"),
                    messageAr = _localization.Get("QA.Errors.QuestionNotFound", "ar")
                });
            }

            return Ok(new
            {
                success = true,
                data = question,
                message = _localization.Get("QA.Success.QuestionRetrieved"),
                messageAr = _localization.Get("QA.Success.QuestionRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving question with slug: {Slug}", slug);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveQuestionFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveQuestionFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Create a new question
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateQuestion(
        [FromBody] CreateQuestionRequest request,
        CancellationToken ct = default)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidQuestionData"),
                    messageAr = _localization.Get("QA.Errors.InvalidQuestionData", "ar"),
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
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

            var question = await _qaService.CreateQuestionAsync(userId.Value, request);
            
            _logger.LogInformation("Question created successfully by user {UserId}: {QuestionId}", userId.Value, question.Id);
            
            return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, new
            {
                success = true,
                data = question,
                message = _localization.Get("QA.Success.QuestionCreated"),
                messageAr = _localization.Get("QA.Success.QuestionCreated", "ar")
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument when creating question");
            return BadRequest(new
            {
                success = false,
                message = _localization.Get("QA.Errors.InvalidQuestionData"),
                messageAr = _localization.Get("QA.Errors.InvalidQuestionData", "ar"),
                errors = new[] { ex.Message }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating question for user: {UserId}", GetUserId());
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.CreateQuestionFailed"),
                messageAr = _localization.Get("QA.Errors.CreateQuestionFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Update an existing question
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateQuestion(
        Guid id, 
        [FromBody] UpdateQuestionRequest request,
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

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidQuestionData"),
                    messageAr = _localization.Get("QA.Errors.InvalidQuestionData", "ar"),
                    errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
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

            var result = await _qaService.UpdateQuestionAsync(id, userId.Value, request);
            
            if (result is null)
            {
                return NotFound(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.QuestionNotFound"),
                    messageAr = _localization.Get("QA.Errors.QuestionNotFound", "ar")
                });
            }

            _logger.LogInformation("Question updated successfully: {QuestionId} by user {UserId}", id, userId.Value);
            
            return Ok(new
            {
                success = true,
                data = result,
                message = _localization.Get("QA.Success.QuestionUpdated"),
                messageAr = _localization.Get("QA.Success.QuestionUpdated", "ar")
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to update question {QuestionId}", id);
            return StatusCode(403, new
            {
                success = false,
                message = _localization.Get("QA.Errors.NotQuestionOwner"),
                messageAr = _localization.Get("QA.Errors.NotQuestionOwner", "ar")
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument when updating question {QuestionId}", id);
            return BadRequest(new
            {
                success = false,
                message = _localization.Get("QA.Errors.InvalidQuestionData"),
                messageAr = _localization.Get("QA.Errors.InvalidQuestionData", "ar"),
                errors = new[] { ex.Message }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating question: {QuestionId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.UpdateQuestionFailed"),
                messageAr = _localization.Get("QA.Errors.UpdateQuestionFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Delete a question
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteQuestion(Guid id, CancellationToken ct = default)
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

            var deleted = await _qaService.DeleteQuestionAsync(id, userId.Value);
            
            if (!deleted)
            {
                return NotFound(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.QuestionNotFound"),
                    messageAr = _localization.Get("QA.Errors.QuestionNotFound", "ar")
                });
            }

            _logger.LogInformation("Question deleted successfully: {QuestionId} by user {UserId}", id, userId.Value);
            
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to delete question {QuestionId}", id);
            return StatusCode(403, new
            {
                success = false,
                message = _localization.Get("QA.Errors.NotQuestionOwner"),
                messageAr = _localization.Get("QA.Errors.NotQuestionOwner", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting question: {QuestionId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.DeleteQuestionFailed"),
                messageAr = _localization.Get("QA.Errors.DeleteQuestionFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Get current user's Q&A quota information
    /// </summary>
    [HttpGet("quota")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetUserQuota(CancellationToken ct = default)
    {
        try
        {
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

            var quota = await _qaService.GetUserQuotaAsync(userId.Value);
            
            return Ok(new
            {
                success = true,
                data = quota,
                message = _localization.Get("QA.Success.QuotaRetrieved"),
                messageAr = _localization.Get("QA.Success.QuotaRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving quota for user: {UserId}", GetUserId());
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveQuotaFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveQuotaFailed", "ar")
            });
        }
    }

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;

    /// <summary>
    /// Gets an anonymous identifier for view tracking (IP hash)
    /// </summary>
    private string? GetAnonymousId()
    {
        if (User.Identity?.IsAuthenticated == true)
            return null; // Use user ID instead for authenticated users

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        if (string.IsNullOrEmpty(ip))
            return null;

        // Hash the IP for privacy
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(ip);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash)[..32]; // First 32 chars of hash
    }
}
