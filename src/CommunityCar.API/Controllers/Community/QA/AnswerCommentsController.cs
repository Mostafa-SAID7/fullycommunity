using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.DTOs.Requests.Community.QA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community.QA;

[ApiController]
[Route("api/community/qa/answers")]
[ApiExplorerSettings(GroupName = "community")]
[Produces("application/json")]
public class AnswerCommentsController : ControllerBase
{
    private readonly IQAService _qaService;
    private readonly ILocalizationService _localization;
    private readonly ILogger<AnswerCommentsController> _logger;

    public AnswerCommentsController(
        IQAService qaService,
        ILocalizationService localization,
        ILogger<AnswerCommentsController> logger)
    {
        _qaService = qaService;
        _localization = localization;
        _logger = logger;
    }

    /// <summary>
    /// Get all comments for a specific answer
    /// </summary>
    [HttpGet("{answerId:guid}/comments")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetComments(Guid answerId, CancellationToken ct = default)
    {
        try
        {
            if (answerId == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidAnswerId"),
                    messageAr = _localization.Get("QA.Errors.InvalidAnswerId", "ar")
                });
            }

            var comments = await _qaService.GetAnswerCommentsAsync(answerId);
            
            return Ok(new
            {
                success = true,
                data = comments,
                message = _localization.Get("QA.Success.CommentsRetrieved"),
                messageAr = _localization.Get("QA.Success.CommentsRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving comments for answer: {AnswerId}", answerId);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveCommentsFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveCommentsFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Add a comment to an answer
    /// </summary>
    [HttpPost("{answerId:guid}/comments")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddComment(
        Guid answerId,
        [FromBody] CreateCommentRequest request,
        CancellationToken ct = default)
    {
        try
        {
            if (answerId == Guid.Empty)
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
                    message = _localization.Get("QA.Errors.InvalidCommentData"),
                    messageAr = _localization.Get("QA.Errors.InvalidCommentData", "ar"),
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

            var comment = await _qaService.AddAnswerCommentAsync(answerId, userId.Value, request);
            
            _logger.LogInformation("Comment added to answer {AnswerId} by user {UserId}", answerId, userId.Value);
            
            return Ok(new
            {
                success = true,
                data = comment,
                message = _localization.Get("QA.Success.CommentAdded"),
                messageAr = _localization.Get("QA.Success.CommentAdded", "ar")
            });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument when adding comment to answer {AnswerId}", answerId);
            return BadRequest(new
            {
                success = false,
                message = _localization.Get("QA.Errors.InvalidCommentData"),
                messageAr = _localization.Get("QA.Errors.InvalidCommentData", "ar"),
                errors = new[] { ex.Message }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding comment to answer: {AnswerId}", answerId);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.AddCommentFailed"),
                messageAr = _localization.Get("QA.Errors.AddCommentFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Update a comment
    /// </summary>
    [HttpPut("comments/{commentId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateComment(
        Guid commentId,
        [FromBody] UpdateCommentRequest request,
        CancellationToken ct = default)
    {
        try
        {
            if (commentId == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidCommentId"),
                    messageAr = _localization.Get("QA.Errors.InvalidCommentId", "ar")
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidCommentData"),
                    messageAr = _localization.Get("QA.Errors.InvalidCommentData", "ar"),
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

            var result = await _qaService.UpdateAnswerCommentAsync(commentId, userId.Value, request);
            
            if (result is null)
            {
                return NotFound(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.CommentNotFound"),
                    messageAr = _localization.Get("QA.Errors.CommentNotFound", "ar")
                });
            }

            _logger.LogInformation("Comment updated: {CommentId} by user {UserId}", commentId, userId.Value);
            
            return Ok(new
            {
                success = true,
                data = result,
                message = _localization.Get("QA.Success.CommentUpdated"),
                messageAr = _localization.Get("QA.Success.CommentUpdated", "ar")
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to update comment {CommentId}", commentId);
            return StatusCode(403, new
            {
                success = false,
                message = _localization.Get("QA.Errors.NotCommentOwner"),
                messageAr = _localization.Get("QA.Errors.NotCommentOwner", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating comment: {CommentId}", commentId);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.UpdateCommentFailed"),
                messageAr = _localization.Get("QA.Errors.UpdateCommentFailed", "ar")
            });
        }
    }

    /// <summary>
    /// Delete a comment
    /// </summary>
    [HttpDelete("comments/{commentId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteComment(Guid commentId, CancellationToken ct = default)
    {
        try
        {
            if (commentId == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidCommentId"),
                    messageAr = _localization.Get("QA.Errors.InvalidCommentId", "ar")
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

            var deleted = await _qaService.DeleteAnswerCommentAsync(commentId, userId.Value);
            
            if (!deleted)
            {
                return NotFound(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.CommentNotFound"),
                    messageAr = _localization.Get("QA.Errors.CommentNotFound", "ar")
                });
            }

            _logger.LogInformation("Comment deleted: {CommentId} by user {UserId}", commentId, userId.Value);
            
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to delete comment {CommentId}", commentId);
            return StatusCode(403, new
            {
                success = false,
                message = _localization.Get("QA.Errors.NotCommentOwner"),
                messageAr = _localization.Get("QA.Errors.NotCommentOwner", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting comment: {CommentId}", commentId);
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.DeleteCommentFailed"),
                messageAr = _localization.Get("QA.Errors.DeleteCommentFailed", "ar")
            });
        }
    }

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}
 /// 