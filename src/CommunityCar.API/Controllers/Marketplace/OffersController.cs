using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Marketplace;
using CommunityCar.Application.Features.Marketplace.Offers;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Marketplace;

[ApiController]
[Route("api/marketplace/offers")]
[Authorize]
public class OffersController : ControllerBase
{
    private readonly IOfferService _offerService;

    public OffersController(IOfferService offerService)
    {
        _offerService = offerService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOffer(Guid id, CancellationToken ct)
    {
        var offer = await _offerService.GetByIdAsync(id, ct);
        return offer is null ? NotFound() : Ok(offer);
    }

    [HttpGet("my/sent")]
    public async Task<IActionResult> GetSentOffers([FromQuery] OfferSearchRequest request, CancellationToken ct)
    {
        var result = await _offerService.GetBuyerOffersAsync(GetUserId(), request, ct);
        return Ok(result);
    }

    [HttpGet("my/received")]
    public async Task<IActionResult> GetReceivedOffers([FromQuery] OfferSearchRequest request, CancellationToken ct)
    {
        var result = await _offerService.GetSellerOffersAsync(GetUserId(), request, ct);
        return Ok(result);
    }

    [HttpGet("product/{productId:guid}")]
    public async Task<IActionResult> GetProductOffers(Guid productId, CancellationToken ct)
    {
        var offers = await _offerService.GetProductOffersAsync(productId, ct);
        return Ok(offers);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOffer([FromBody] CreateOfferRequest request, CancellationToken ct)
    {
        var offer = await _offerService.CreateAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetOffer), new { id = offer.Id }, offer);
    }

    [HttpPost("{id:guid}/respond")]
    public async Task<IActionResult> RespondToOffer(Guid id, [FromBody] RespondToOfferRequest request, CancellationToken ct)
    {
        var offer = await _offerService.RespondAsync(id, GetUserId(), request, ct);
        return Ok(offer);
    }

    [HttpPost("{id:guid}/accept-counter")]
    public async Task<IActionResult> AcceptCounterOffer(Guid id, CancellationToken ct)
    {
        var offer = await _offerService.AcceptCounterOfferAsync(id, GetUserId(), ct);
        return Ok(offer);
    }

    [HttpPost("{id:guid}/withdraw")]
    public async Task<IActionResult> WithdrawOffer(Guid id, CancellationToken ct)
    {
        await _offerService.WithdrawAsync(id, GetUserId(), ct);
        return NoContent();
    }
}
