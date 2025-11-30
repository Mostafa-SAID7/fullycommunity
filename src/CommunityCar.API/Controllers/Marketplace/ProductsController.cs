using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Marketplace;
using CommunityCar.Application.Features.Marketplace.Products;
using CommunityCar.Domain.Entities.Marketplace.Common;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Marketplace;

[ApiController]
[Route("api/marketplace/products")]
[Authorize]
[ApiExplorerSettings(GroupName = "marketplace")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProduct(Guid id, CancellationToken ct)
    {
        await _productService.IncrementViewAsync(id, ct);
        var product = await _productService.GetByIdAsync(id, ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProductBySlug(string slug, CancellationToken ct)
    {
        var product = await _productService.GetBySlugAsync(slug, ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchProducts([FromQuery] ProductSearchRequest request, CancellationToken ct)
    {
        var result = await _productService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("category/{category}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByCategory(MarketplaceCategory category, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _productService.GetByCategoryAsync(category, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var products = await _productService.GetFeaturedAsync(count, ct);
        return Ok(products);
    }

    [HttpGet("recent")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRecent([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var products = await _productService.GetRecentAsync(count, ct);
        return Ok(products);
    }

    [HttpGet("{id:guid}/related")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRelated(Guid id, [FromQuery] int count = 10, CancellationToken ct = default)
    {
        var products = await _productService.GetRelatedAsync(id, count, ct);
        return Ok(products);
    }

    [HttpGet("compare")]
    [AllowAnonymous]
    public async Task<IActionResult> CompareByPartNumber([FromQuery] string partNumber, CancellationToken ct)
    {
        var comparisons = await _productService.CompareAsync(partNumber, ct);
        return Ok(comparisons);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request, CancellationToken ct)
    {
        var product = await _productService.CreateAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request, CancellationToken ct)
    {
        var product = await _productService.UpdateAsync(id, request, ct);
        return Ok(product);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> PublishProduct(Guid id, CancellationToken ct)
    {
        await _productService.PublishAsync(id, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/unpublish")]
    public async Task<IActionResult> UnpublishProduct(Guid id, CancellationToken ct)
    {
        await _productService.UnpublishAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken ct)
    {
        await _productService.DeleteAsync(id, ct);
        return NoContent();
    }
}
