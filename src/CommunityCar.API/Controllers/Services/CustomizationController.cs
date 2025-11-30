using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;
using CommunityCar.Application.Features.Services.Customization;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/customization")]
[Authorize]
public class CustomizationController : ControllerBase
{
    private readonly ICustomizationService _customizationService;

    public CustomizationController(ICustomizationService customizationService)
    {
        _customizationService = customizationService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Shops
    [HttpGet("shops/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetShop(Guid id, CancellationToken ct)
    {
        var shop = await _customizationService.GetShopByIdAsync(id, ct);
        return shop is null ? NotFound() : Ok(shop);
    }

    [HttpGet("shops")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchShops([FromQuery] CustomizationShopSearchRequest request, CancellationToken ct)
    {
        var result = await _customizationService.SearchShopsAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("shops/{shopId:guid}/services")]
    [AllowAnonymous]
    public async Task<IActionResult> GetShopServices(Guid shopId, CancellationToken ct)
    {
        var services = await _customizationService.GetShopServicesAsync(shopId, ct);
        return Ok(services);
    }

    // Portfolio
    [HttpGet("portfolio")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPortfolio([FromQuery] PortfolioSearchRequest request, CancellationToken ct)
    {
        var result = await _customizationService.GetPortfolioAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("portfolio/featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeaturedProjects([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _customizationService.GetFeaturedProjectsAsync(page, pageSize, ct);
        return Ok(result);
    }

    // Projects
    [HttpPost("projects")]
    public async Task<IActionResult> CreateProject([FromBody] CreateCustomizationProjectRequest request, CancellationToken ct)
    {
        var project = await _customizationService.CreateProjectAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpGet("projects/{id:guid}")]
    public async Task<IActionResult> GetProject(Guid id, CancellationToken ct)
    {
        var project = await _customizationService.GetProjectByIdAsync(id, ct);
        return project is null ? NotFound() : Ok(project);
    }

    [HttpGet("projects/my")]
    public async Task<IActionResult> GetMyProjects([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _customizationService.GetCustomerProjectsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("projects/{id:guid}/approve-quote")]
    public async Task<IActionResult> ApproveQuote(Guid id, CancellationToken ct)
    {
        var project = await _customizationService.ApproveQuoteAsync(id, ct);
        return Ok(project);
    }

    [HttpPost("projects/{id:guid}/like")]
    public async Task<IActionResult> LikeProject(Guid id, CancellationToken ct)
    {
        await _customizationService.LikeProjectAsync(id, GetUserId(), ct);
        return NoContent();
    }

    [HttpPost("projects/{id:guid}/rate")]
    public async Task<IActionResult> RateProject(Guid id, [FromBody] RateRequest request, CancellationToken ct)
    {
        await _customizationService.RateProjectAsync(id, request.Rating, request.ReviewText, ct);
        return NoContent();
    }
}
