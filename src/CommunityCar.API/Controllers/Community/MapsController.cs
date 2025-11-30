using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Features.Community.Maps.DTOs;
using CommunityCar.Domain.Entities.Community.Maps;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Community;

[ApiController]
[Route("api/community/maps")]
public class MapsController : ControllerBase
{
    private readonly IMapService _mapService;

    public MapsController(IMapService mapService) => _mapService = mapService;

    [HttpGet("locations")]
    public async Task<IActionResult> GetLocations([FromQuery] LocationFilter filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _mapService.GetLocationsAsync(filter, page, pageSize));

    [HttpGet("locations/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var location = await _mapService.GetByIdAsync(id, GetUserId());
        return location is null ? NotFound() : Ok(location);
    }

    [HttpGet("locations/slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var location = await _mapService.GetBySlugAsync(slug, GetUserId());
        return location is null ? NotFound() : Ok(location);
    }

    [HttpGet("locations/nearby")]
    public async Task<IActionResult> GetNearby([FromQuery] NearbySearchRequest request)
        => Ok(await _mapService.GetNearbyLocationsAsync(request));

    [HttpGet("locations/search")]
    public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] LocationType? type, [FromQuery] int count = 20)
        => Ok(await _mapService.SearchLocationsAsync(query, type, count));

    [HttpPost("locations")]
    [Authorize]
    public async Task<IActionResult> Create(CreateLocationRequest request)
    {
        var location = await _mapService.CreateAsync(GetUserId(), request);
        return CreatedAtAction(nameof(GetById), new { id = location.Id }, location);
    }

    [HttpPut("locations/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, UpdateLocationRequest request)
        => Ok(await _mapService.UpdateAsync(id, GetUserId()!.Value, request));

    [HttpDelete("locations/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
        => await _mapService.DeleteAsync(id, GetUserId()!.Value) ? NoContent() : NotFound();

    // Reviews
    [HttpGet("locations/{id:guid}/reviews")]
    public async Task<IActionResult> GetReviews(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _mapService.GetReviewsAsync(id, page, pageSize));

    [HttpPost("locations/{id:guid}/reviews")]
    [Authorize]
    public async Task<IActionResult> AddReview(Guid id, CreateLocationReviewRequest request)
        => Ok(await _mapService.AddReviewAsync(id, GetUserId()!.Value, request));

    [HttpPut("reviews/{reviewId:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateReview(Guid reviewId, CreateLocationReviewRequest request)
        => Ok(await _mapService.UpdateReviewAsync(reviewId, GetUserId()!.Value, request));

    [HttpDelete("reviews/{reviewId:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(Guid reviewId)
        => await _mapService.DeleteReviewAsync(reviewId, GetUserId()!.Value) ? NoContent() : NotFound();

    [HttpPost("reviews/{reviewId:guid}/helpful")]
    [Authorize]
    public async Task<IActionResult> MarkHelpful(Guid reviewId)
        => await _mapService.MarkReviewHelpfulAsync(reviewId, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("reviews/{reviewId:guid}/respond")]
    [Authorize]
    public async Task<IActionResult> RespondToReview(Guid reviewId, [FromBody] string response)
        => await _mapService.RespondToReviewAsync(reviewId, GetUserId()!.Value, response) ? Ok() : BadRequest();

    // Check-ins
    [HttpPost("locations/{id:guid}/checkin")]
    [Authorize]
    public async Task<IActionResult> CheckIn(Guid id, CheckInRequest request)
        => await _mapService.CheckInAsync(id, GetUserId()!.Value, request) ? Ok() : BadRequest();

    [HttpGet("checkins")]
    [Authorize]
    public async Task<IActionResult> GetMyCheckIns([FromQuery] int count = 20)
        => Ok(await _mapService.GetUserCheckInsAsync(GetUserId()!.Value, count));

    // Saved locations
    [HttpPost("locations/{id:guid}/save")]
    [Authorize]
    public async Task<IActionResult> SaveLocation(Guid id, [FromQuery] string? listName, [FromQuery] string? note)
        => await _mapService.SaveLocationAsync(id, GetUserId()!.Value, listName, note) ? Ok() : BadRequest();

    [HttpDelete("locations/{id:guid}/save")]
    [Authorize]
    public async Task<IActionResult> UnsaveLocation(Guid id)
        => await _mapService.UnsaveLocationAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpGet("saved")]
    [Authorize]
    public async Task<IActionResult> GetSavedLocations([FromQuery] string? listName, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _mapService.GetSavedLocationsAsync(GetUserId()!.Value, listName, page, pageSize));

    // Verification
    [HttpPost("locations/{id:guid}/claim")]
    [Authorize]
    public async Task<IActionResult> ClaimLocation(Guid id)
        => await _mapService.ClaimLocationAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    [HttpPost("locations/{id:guid}/verify")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> VerifyLocation(Guid id)
        => await _mapService.VerifyLocationAsync(id, GetUserId()!.Value) ? Ok() : BadRequest();

    private Guid? GetUserId() => User.Identity?.IsAuthenticated == true
        ? Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
        : null;
}
