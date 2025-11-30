using CommunityCar.Application.Features.Marketplace.Cart;

namespace CommunityCar.Application.Common.Interfaces.Marketplace;

public interface ICartService
{
    // Cart
    Task<CartDto> GetCartAsync(Guid userId, CancellationToken ct = default);
    Task<CartItemDto> AddToCartAsync(Guid userId, AddToCartRequest request, CancellationToken ct = default);
    Task<CartItemDto> UpdateCartItemAsync(Guid userId, Guid itemId, UpdateCartItemRequest request, CancellationToken ct = default);
    Task RemoveFromCartAsync(Guid userId, Guid itemId, CancellationToken ct = default);
    Task ClearCartAsync(Guid userId, CancellationToken ct = default);
    
    // Wishlist
    Task<List<WishlistItemDto>> GetWishlistAsync(Guid userId, CancellationToken ct = default);
    Task<WishlistItemDto> AddToWishlistAsync(Guid userId, AddToWishlistRequest request, CancellationToken ct = default);
    Task RemoveFromWishlistAsync(Guid userId, Guid productId, CancellationToken ct = default);
    Task<bool> IsInWishlistAsync(Guid userId, Guid productId, CancellationToken ct = default);
    Task MoveToCartAsync(Guid userId, Guid productId, CancellationToken ct = default);
}
