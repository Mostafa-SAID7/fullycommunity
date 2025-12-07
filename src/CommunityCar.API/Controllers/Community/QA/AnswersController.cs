using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using CommunityCar.Domain.Enums.Community.QA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community.QA;

[ApiController]
[Route("api/community/qa")]
[ApiExplorerSettings(GroupName = "community")]
[Produces("application/json")]
public class AnswersController : ControllerBase
{
    private readonly IQAService _qaService;
    private readonly ILocalizationService _localization;
    private readonly ILogger<AnswersController> _logger;

    public AnswersController(
        IQAService qaService,
        ILocalizationService localization,
        ILogger<AnswersController> logger)
    {
        _qaService = qaService;
        _localization = localization;
        _logger = logger;
    }

    /// <summary>
    /// Get all answers for a specific question
    /// </summary>
    [HttpGet("questions/{questionId:guid}/answers")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAnswers(Guid questionId, CancellationToken ct = default)
    {
        try
        {
            if (questionId == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidQuestionId"),
                    messageAr = _localization.Get("QA.Errors.InvalidQuestionId", "ar")
                });
            }

            var answers = await _qaService.GetAnswersAsync(questionId, GetUserId());
            
            return Ok(new
            {
                success = true,
                data = answers,
                message = _localization.Get("QA.Success.AnswersRetrieved"),
                messageAr = _localization.Get("QA.Success.AnswersRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving answers for question: {QuestionId}", questionId);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveAnswersFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveAnswersFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Create a new answer for a question
    /// </summary>
    [HttpPost("questions/{questionId:guid}/answers")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateAnswer(
        Guid questionId, 
        [FromBody] CreateAnswerRequest request,
        CancellationToken ct = default)
    {
        try
        {
            if (questionId == Guid.Empty)
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
                    message = _localization.Get("QA.Errors.InvalidAnswerData"),
                    messageAr = _localization.Get("QA.Errors.InvalidAnswerData", "ar"),
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

            var answer = await _qaService.CreateAnswerAsync(questionId, userId.Value, request);
            
            _logger.LogInformation("Answer created for question {QuestionId} by user {UserId}", questionId, userId.Value);
            
            return Ok(new
            {
                success = true,
                data = answer,
                message = _localization.Get("QA.Success.AnswerCreated"),
                messageAr = _localization.Get("QA.Success.AnswerCreated", "ar")
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument when creating answer for question {QuestionId}", questionId);
            return BadRequest(new
            {
                success = false,
                message = _localization.Get("QA.Errors.InvalidAnswerData"),
                messageAr = _localization.Get("QA.Errors.InvalidAnswerData", "ar"),
                errors = new[] { ex.Message }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating answer for question: {QuestionId}", questionId);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.CreateAnswerFailed"),
                messageAr = _localization.Get("QA.Errors.CreateAnswerFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Update an existing answer
    /// </summary>
    [HttpPut("answers/{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateAnswer(
        Guid id, 
        [FromBody] UpdateAnswerRequest request,
        CancellationToken ct = default)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidAnswerId"),
                    messageAr = _localization.Get("QA.Errors.InvalidAnswerId", "ar")
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidAnswerData"),
                    messageAr = _localization.Get("QA.Errors.InvalidAnswerData", "ar"),
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

            var result = await _qaService.UpdateAnswerAsync(id, userId.Value, request);
            
            if (result is null)
            {
                return NotFound(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.AnswerNotFound"),
                    messageAr = _localization.Get("QA.Errors.AnswerNotFound", "ar")
                });
            }

            _logger.LogInformation("Answer updated: {AnswerId} by user {UserId}", id, userId.Value);
            
            return Ok(new
            {
                success = true,
                data = result,
                message = _localization.Get("QA.Success.AnswerUpdated"),
                messageAr = _localization.Get("QA.Success.AnswerUpdated", "ar")
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to update answer {AnswerId}", id);
            return StatusCode(403, new
            {
                success = false,
                message = _localization.Get("QA.Errors.NotAnswerOwner"),
                messageAr = _localization.Get("QA.Errors.NotAnswerOwner", "ar")
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument when updating answer {AnswerId}", id);
            return BadRequest(new
            {
                success = false,
                message = _localization.Get("QA.Errors.InvalidAnswerData"),
                messageAr = _localization.Get("QA.Errors.InvalidAnswerData", "ar"),
                errors = new[] { ex.Message }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating answer: {AnswerId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.UpdateAnswerFailed"),
                messageAr = _localization.Get("QA.Errors.UpdateAnswerFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Delete an answer
    /// </summary>
    /// [HttpDelete("answers/{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteAnswer(Guid id, CancellationToken ct = default)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidAnswerId"),
                    messageAr = _localization.Get("QA.Errors.InvalidAnswerId", "ar")
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

            var deleted = await _qaService.DeleteAnswerAsync(id, userId.Value);
            
            if (!deleted)
            {
                return NotFound(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.AnswerNotFound"),
                    messageAr = _localization.Get("QA.Errors.AnswerNotFound", "ar")
                });
            }

            _logger.LogInformation("Answer deleted: {AnswerId} by user {UserId}", id, userId.Value);
            
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to delete answer {AnswerId}", id);
            return StatusCode(403, new
            {
                success = false,
                message = _localization.Get("QA.Errors.NotAnswerOwner"),
                messageAr = _localization.Get("QA.Errors.NotAnswerOwner", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting answer: {AnswerId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.DeleteAnswerFailed"),
                messageAr = _localization.Get("QA.Errors.DeleteAnswerFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Accept an answer as the solution to a question
    /// </summary>
    [HttpPost("answers/{id:guid}/accept")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AcceptAnswer(Guid id, CancellationToken ct = default)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidAnswerId"),
                    messageAr = _localization.Get("QA.Errors.InvalidAnswerId", "ar")
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

            var accepted = await _qaService.AcceptAnswerAsync(id, userId.Value);
            
            if (!accepted)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.AcceptAnswerFailed"),
                    messageAr = _localization.Get("QA.Errors.AcceptAnswerFailed", "ar")
                });
            }

            _logger.LogInformation("Answer accepted: {AnswerId} by user {UserId}", id, userId.Value);
            
            return Ok(new
            {
                success = true,
                message = _localization.Get("QA.Success.AnswerAccepted"),
                messageAr = _localization.Get("QA.Success.AnswerAccepted", "ar")
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to accept answer {AnswerId}", id);
            return StatusCode(403, new
            {
                success = false,
                message = _localization.Get("QA.Errors.OnlyQuestionOwnerCanAccept"),
                messageAr = _localization.Get("QA.Errors.OnlyQuestionOwnerCanAccept", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error accepting answer: {AnswerId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.AcceptAnswerFailed"),
                messageAr = _localization.Get("QA.Errors.AcceptAnswerFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Vote on an answer (upvote or downvote)
    /// /// </summary>
    [HttpPost("answers/{id:guid}/vote")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> VoteAnswer(
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
                    message = _localization.Get("QA.Errors.InvalidAnswerId"),
                    messageAr = _localization.Get("QA.Errors.InvalidAnswerId", "ar")
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

            var voteCount = await _qaService.VoteAnswerAsync(id, userId.Value, type);
            
            _logger.LogInformation("Answer vote recorded: {AnswerId} by user {UserId}, type: {VoteType}", id, userId.Value, type);
            
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
            _logger.LogWarning(ex, "Invalid vote operation for answer {AnswerId}", id);
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
            _logger.LogError(ex, "Error voting on answer: {AnswerId}", id);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.VoteFailed"),
                messageAr = _localization.Get("QA.Errors.VoteFailed", "ar")
            });
        }
    }

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}
