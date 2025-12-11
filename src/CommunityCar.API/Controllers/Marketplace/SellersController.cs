using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Marketplace;

using System.Security.Claims;

namespace CommunityCar.API.Controllers.Marketplace;

[ApiController]
[Route("api/marketplace/sellers")]
[Authorize]
[ApiExplorerSettings(GroupName = "marketplace")]
public class SellersController : ControllerBase
{
    private readonly ISellerService _sellerService;
    private readonly IProductService _productService;

    public SellersController(ISellerService sellerService, IProductService productService)
    {
        _sellerService = sellerService;
        _productService = productService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSeller(Guid id, CancellationToken ct)
    {
        var seller = await _sellerService.GetByIdAsync(id, ct);
        return seller is null ? NotFound() : Ok(seller);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSellerBySlug(string slug, CancellationToken ct)
    {
        var seller = await _sellerService.GetBySlugAsync(slug, ct);
        return seller is null ? NotFound() : Ok(seller);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchSellers([FromQuery] SellerSearchRequest request, CancellationToken ct)
    {
        var result = await _sellerService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("top")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTopSellers([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var sellers = await _sellerService.GetTopSellersAsync(count, ct);
        return Ok(sellers);
    }

    [HttpGet("{id:guid}/products")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSellerProducts(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var products = await _productService.GetSellerProductsAsync(id, page, pageSize, ct);
        return Ok(products);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMySellerProfile(CancellationToken ct)
    {
        var seller = await _sellerService.GetByUserIdAsync(GetUserId(), ct);
        return seller is null ? NotFound() : Ok(seller);
    }

    [HttpGet("me/stats")]
    public async Task<IActionResult> GetMyStats(CancellationToken ct)
    {
        var seller = await _sellerService.GetByUserIdAsync(GetUserId(), ct);
        if (seller is null) return NotFound();
        var stats = await _sellerService.GetStatsAsync(seller.Id, ct);
        return Ok(stats);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSeller([FromBody] CreateSellerRequest request, CancellationToken ct)
    {
        var seller = await _sellerService.CreateAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetSeller), new { id = seller.Id }, seller);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateSeller([FromBody] UpdateSellerRequest request, CancellationToken ct)
    {
        var seller = await _sellerService.GetByUserIdAsync(GetUserId(), ct);
        if (seller is null) return NotFound();
        var updated = await _sellerService.UpdateAsync(seller.Id, request, ct);
        return Ok(updated);
    }
}
