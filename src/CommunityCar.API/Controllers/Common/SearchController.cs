using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Infrastructure;

namespace CommunityCar.API.Controllers.Common;

[ApiController]
[Route("api/search")]
[ApiExplorerSettings(GroupName = "pages")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _search;

    public SearchController(ISearchService search) => _search = search;

    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] List<SearchCategory>? categories = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest("Search query is required");

        var options = new SearchOptions
        {
            Categories = categories,
            Page = page,
            PageSize = pageSize
        };

        var results = await _search.SearchAsync(q, options, ct);
        return Ok(results);
    }

    [HttpGet("suggestions")]
    public async Task<IActionResult> GetSuggestions([FromQuery] string q, [FromQuery] int limit = 10, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(q))
            return Ok(new List<SearchSuggestion>());

        var suggestions = await _search.GetSuggestionsAsync(q, limit, ct);
        return Ok(suggestions);
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending([FromQuery] SearchCategory? category = null, [FromQuery] int limit = 10, CancellationToken ct = default)
    {
        var trending = await _search.GetTrendingAsync(category, limit, ct);
        return Ok(trending);
    }
}
