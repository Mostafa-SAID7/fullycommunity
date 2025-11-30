

using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Community.Maps.DTOs;
using CommunityCar.Domain.Entities.Community.Maps;

namespace CommunityCar.Application.Common.Interfaces.Community;

public interface IMapService
{
    // Locations
    Task<MapLocationDto?> GetByIdAsync(Guid id, Guid? currentUserId = null);
    Task<MapLocationDto?> GetBySlugAsync(string slug, Guid? currentUserId = null);
    Task<PagedResult<MapLocationListDto>> GetLocationsAsync(LocationFilter filter, int page = 1, int pageSize = 20);
    Task<IEnumerable<MapLocationListDto>> GetNearbyLocationsAsync(NearbySearchRequest request);
    Task<IEnumerable<MapLocationListDto>> SearchLocationsAsync(string query, LocationType? type = null, int count = 20);
    Task<MapLocationDto> CreateAsync(Guid? userId, CreateLocationRequest request);
    Task<MapLocationDto> UpdateAsync(Guid locationId, Guid userId, UpdateLocationRequest request);
    Task<bool> DeleteAsync(Guid locationId, Guid userId);
    
    // Reviews
    Task<PagedResult<LocationReviewDto>> GetReviewsAsync(Guid locationId, int page = 1, int pageSize = 20);
    Task<LocationReviewDto> AddReviewAsync(Guid locationId, Guid userId, CreateLocationReviewRequest request);
    Task<LocationReviewDto> UpdateReviewAsync(Guid reviewId, Guid userId, CreateLocationReviewRequest request);
    Task<bool> DeleteReviewAsync(Guid reviewId, Guid userId);
    Task<bool> MarkReviewHelpfulAsync(Guid reviewId, Guid userId);
    Task<bool> RespondToReviewAsync(Guid reviewId, Guid ownerId, string response);
    
    // Check-ins
    Task<bool> CheckInAsync(Guid locationId, Guid userId, CheckInRequest request);
    Task<IEnumerable<LocationCheckIn>> GetUserCheckInsAsync(Guid userId, int count = 20);
    
    // Saved locations
    Task<bool> SaveLocationAsync(Guid locationId, Guid userId, string? listName = null, string? note = null);
    Task<bool> UnsaveLocationAsync(Guid locationId, Guid userId);
    Task<PagedResult<MapLocationListDto>> GetSavedLocationsAsync(Guid userId, string? listName = null, int page = 1, int pageSize = 20);
    
    // Verification
    Task<bool> ClaimLocationAsync(Guid locationId, Guid userId);
    Task<bool> VerifyLocationAsync(Guid locationId, Guid adminId);
}

public record LocationFilter(
    LocationType? Type = null,
    LocationStatus? Status = null,
    string? City = null,
    string? Country = null,
    decimal? MinRating = null,
    bool? IsVerified = null,
    bool? IsOpen24Hours = null,
    List<string>? Features = null,
    string? SearchTerm = null,
    string? SortBy = null // rating, reviews, distance, newest
);
