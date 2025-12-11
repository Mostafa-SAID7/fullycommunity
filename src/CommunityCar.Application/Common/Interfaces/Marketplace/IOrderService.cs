using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Marketplace;
using CommunityCar.Application.DTOs.Requests.Marketplace;

namespace CommunityCar.Application.Common.Interfaces.Marketplace;

public interface IOrderService
{
    Task<OrderDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<OrderDto?> GetByOrderNumberAsync(string orderNumber, CancellationToken ct = default);
    Task<PagedResult<OrderDto>> GetBuyerOrdersAsync(Guid buyerId, OrderSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<OrderDto>> GetSellerOrdersAsync(Guid sellerId, OrderSearchRequest request, CancellationToken ct = default);
    
    Task<OrderDto> CreateAsync(Guid buyerId, CreateOrderRequest request, CancellationToken ct = default);
    Task<OrderDto> UpdateStatusAsync(Guid id, UpdateOrderStatusRequest request, CancellationToken ct = default);
    Task<OrderDto> ShipOrderAsync(Guid id, ShipOrderRequest request, CancellationToken ct = default);
    Task<OrderDto> MarkDeliveredAsync(Guid id, CancellationToken ct = default);
    Task CancelOrderAsync(Guid id, string reason, CancellationToken ct = default);
    Task<OrderDto> RefundOrderAsync(Guid id, decimal amount, string reason, CancellationToken ct = default);
    
    Task<decimal> CalculateShippingAsync(Guid productId, string destinationPostalCode, string destinationCountry, CancellationToken ct = default);
}
