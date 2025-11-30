using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Marketplace;
using CommunityCar.Application.Features.Marketplace.Orders;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Marketplace;

[ApiController]
[Route("api/marketplace/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id, CancellationToken ct)
    {
        var order = await _orderService.GetByIdAsync(id, ct);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpGet("number/{orderNumber}")]
    public async Task<IActionResult> GetOrderByNumber(string orderNumber, CancellationToken ct)
    {
        var order = await _orderService.GetByOrderNumberAsync(orderNumber, ct);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpGet("my/purchases")]
    public async Task<IActionResult> GetMyPurchases([FromQuery] OrderSearchRequest request, CancellationToken ct)
    {
        var result = await _orderService.GetBuyerOrdersAsync(GetUserId(), request, ct);
        return Ok(result);
    }

    [HttpGet("my/sales")]
    public async Task<IActionResult> GetMySales([FromQuery] OrderSearchRequest request, CancellationToken ct)
    {
        var result = await _orderService.GetSellerOrdersAsync(GetUserId(), request, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request, CancellationToken ct)
    {
        var order = await _orderService.CreateAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request, CancellationToken ct)
    {
        var order = await _orderService.UpdateStatusAsync(id, request, ct);
        return Ok(order);
    }

    [HttpPost("{id:guid}/ship")]
    public async Task<IActionResult> ShipOrder(Guid id, [FromBody] ShipOrderRequest request, CancellationToken ct)
    {
        var order = await _orderService.ShipOrderAsync(id, request, ct);
        return Ok(order);
    }

    [HttpPost("{id:guid}/delivered")]
    public async Task<IActionResult> MarkDelivered(Guid id, CancellationToken ct)
    {
        var order = await _orderService.MarkDeliveredAsync(id, ct);
        return Ok(order);
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelOrder(Guid id, [FromBody] string reason, CancellationToken ct)
    {
        await _orderService.CancelOrderAsync(id, reason, ct);
        return NoContent();
    }

    [HttpGet("shipping-quote")]
    public async Task<IActionResult> GetShippingQuote([FromQuery] Guid productId, [FromQuery] string postalCode, [FromQuery] string country, CancellationToken ct)
    {
        var cost = await _orderService.CalculateShippingAsync(productId, postalCode, country, ct);
        return Ok(new { ShippingCost = cost });
    }
}
