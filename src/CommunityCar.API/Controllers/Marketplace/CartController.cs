using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Marketplace;
using CommunityCar.Application.Features.Marketplace.Cart;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Marketplace;

[ApiController]
[Route("api/marketplace/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetCart(CancellationToken ct)
    {
        var cart = await _cartService.GetCartAsync(GetUserId(), ct);
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request, CancellationToken ct)
    {
        var item = await _cartService.AddToCartAsync(GetUserId(), request, ct);
        return Ok(item);
    }

    [HttpPut("items/{itemId:guid}")]
    public async Task<IActionResult> UpdateCartItem(Guid itemId, [FromBody] UpdateCartItemRequest request, CancellationToken ct)
    {
        var item = await _cartService.UpdateCartItemAsync(GetUserId(), itemId, request, ct);
        return Ok(item);
    }

    [HttpDelete("items/{itemId:guid}")]
    public async Task<IActionResult> RemoveFromCart(Guid itemId, CancellationToken ct)
    {
        await _cartService.RemoveFromCartAsync(GetUserId(), itemId, ct);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart(CancellationToken ct)
    {
        await _cartService.ClearCartAsync(GetUserId(), ct);
        return NoContent();
    }

    // Wishlist
    [HttpGet("wishlist")]
    public async Task<IActionResult> GetWishlist(CancellationToken ct)
    {
        var wishlist = await _cartService.GetWishlistAsync(GetUserId(), ct);
        return Ok(wishlist);
    }

    [HttpPost("wishlist")]
    public async Task<IActionResult> AddToWishlist([FromBody] AddToWishlistRequest request, CancellationToken ct)
    {
        var item = await _cartService.AddToWishlistAsync(GetUserId(), request, ct);
        return Ok(item);
    }

    [HttpDelete("wishlist/{productId:guid}")]
    public async Task<IActionResult> RemoveFromWishlist(Guid productId, CancellationToken ct)
    {
        await _cartService.RemoveFromWishlistAsync(GetUserId(), productId, ct);
        return NoContent();
    }

    [HttpGet("wishlist/{productId:guid}/check")]
    public async Task<IActionResult> IsInWishlist(Guid productId, CancellationToken ct)
    {
        var isInWishlist = await _cartService.IsInWishlistAsync(GetUserId(), productId, ct);
        return Ok(new { IsInWishlist = isInWishlist });
    }

    [HttpPost("wishlist/{productId:guid}/move-to-cart")]
    public async Task<IActionResult> MoveToCart(Guid productId, CancellationToken ct)
    {
        await _cartService.MoveToCartAsync(GetUserId(), productId, ct);
        return NoContent();
    }
}
