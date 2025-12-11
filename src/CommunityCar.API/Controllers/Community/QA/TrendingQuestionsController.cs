using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Community;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCar.API.Controllers.Community.QA;

[ApiController]
[Route("api/community/trending-questions")]
[ApiExplorerSettings(GroupName = "community")]
[Produces("application/json")]
public class TrendingQuestionsController : ControllerBase
{
    private readonly IQAService _qaService;
    private readonly ILocalizationService _localization;
    private readonly ILogger<TrendingQuestionsController> _logger;

    public TrendingQuestionsController(
        IQAService qaService,
        ILocalizationService localization,
        ILogger<TrendingQuestionsController> logger)
    {
        _qaService = qaService;
        _localization = localization;
        _logger = logger;
    }

    /// <summary>
    /// Get trending questions based on votes, views, and activity
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetTrendingQuestions([FromQuery] int count = 5, CancellationToken ct = default)
    {
        try
        {
            if (count < 1 || count > 20)
            {
                return BadRequest(new
                {
                    success = false,
                    message = _localization.Get("QA.Errors.InvalidCount"),
                    messageAr = _localization.Get("QA.Errors.InvalidCount", "ar"),
                    errors = new[] { "Count must be between 1 and 20" }
                });
            }

            var trendingQuestions = await _qaService.GetTrendingQuestionsAsync(count);

            return Ok(new
            {
                success = true,
                data = trendingQuestions,
                message = _localization.Get("QA.Success.TrendingQuestionsRetrieved"),
                messageAr = _localization.Get("QA.Success.TrendingQuestionsRetrieved", "ar")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving trending questions");
            return StatusCode(500, new
            {
                success = false,
                message = _localization.Get("QA.Errors.RetrieveQuestionsFailed"),
                messageAr = _localization.Get("QA.Errors.RetrieveQuestionsFailed", "ar")
            });
        }
    }
}
