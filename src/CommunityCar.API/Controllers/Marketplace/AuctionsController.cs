using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Marketplace;
using CommunityCar.Application.DTOs.Requests.Marketplace;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Marketplace;

[ApiController]
[Route("api/marketplace/auctions")]
[Authorize]
[ApiExplorerSettings(GroupName = "marketplace")]
public class AuctionsController : ControllerBase
{
    private readonly IAuctionService _auctionService;

    public AuctionsController(IAuctionService auctionService)
    {
        _auctionService = auctionService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAuction(Guid id, CancellationToken ct)
    {
        var auction = await _auctionService.GetByIdAsync(id, ct);
        return auction is null ? NotFound() : Ok(auction);
    }

    [HttpGet("number/{auctionNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAuctionByNumber(string auctionNumber, CancellationToken ct)
    {
        var auction = await _auctionService.GetByAuctionNumberAsync(auctionNumber, ct);
        return auction is null ? NotFound() : Ok(auction);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> SearchAuctions([FromQuery] AuctionSearchRequest request, CancellationToken ct)
    {
        var result = await _auctionService.SearchAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("ending-soon")]
    [AllowAnonymous]
    public async Task<IActionResult> GetEndingSoon([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var auctions = await _auctionService.GetEndingSoonAsync(count, ct);
        return Ok(auctions);
    }

    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10, CancellationToken ct = default)
    {
        var auctions = await _auctionService.GetFeaturedAsync(count, ct);
        return Ok(auctions);
    }

    [HttpGet("{id:guid}/bids")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBids(Guid id, CancellationToken ct)
    {
        var bids = await _auctionService.GetBidsAsync(id, ct);
        return Ok(bids);
    }

    [HttpGet("my/bids")]
    public async Task<IActionResult> GetMyBids(CancellationToken ct)
    {
        var bids = await _auctionService.GetUserBidsAsync(GetUserId(), ct);
        return Ok(bids);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAuction([FromBody] CreateAuctionRequest request, CancellationToken ct)
    {
        var auction = await _auctionService.CreateAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetAuction), new { id = auction.Id }, auction);
    }

    [HttpPost("{id:guid}/bid")]
    public async Task<IActionResult> PlaceBid(Guid id, [FromBody] PlaceBidRequest request, CancellationToken ct)
    {
        var bid = await _auctionService.PlaceBidAsync(id, GetUserId(), request, ct);
        return Ok(bid);
    }

    [HttpPost("{id:guid}/buy-it-now")]
    public async Task<IActionResult> BuyItNow(Guid id, CancellationToken ct)
    {
        var order = await _auctionService.BuyItNowAsync(id, GetUserId(), ct);
        return Ok(order);
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelAuction(Guid id, [FromBody] string reason, CancellationToken ct)
    {
        await _auctionService.CancelAuctionAsync(id, reason, ct);
        return NoContent();
    }
}
