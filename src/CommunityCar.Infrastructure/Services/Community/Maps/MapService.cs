using CommunityCar.Application.Common.Helpers;
using CommunityCar.Application.Common.Interfaces.Community;
using CommunityCar.Application.Common.Interfaces.Data;
using CommunityCar.Application.Common.Mappers.Community;
using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Community.Maps;
using CommunityCar.Application.DTOs.Response.Community.Maps;
using CommunityCar.Domain.Entities.Community.Maps;
using CommunityCar.Domain.Enums.Community.Maps;
using Microsoft.EntityFrameworkCore;
using static CommunityCar.Application.Common.Interfaces.Community.IMapService;

namespace CommunityCar.Infrastructure.Services.Community.Maps;

public class MapService : IMapService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRepository<MapLocation> _locationRepository;
    private readonly IRepository<LocationReview> _reviewRepository;
    private readonly IRepository<LocationCheckIn> _checkInRepository;
    private readonly IRepository<SavedLocation> _savedLocationRepository;

    public MapService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _locationRepository = unitOfWork.Repository<MapLocation>();
        _reviewRepository = unitOfWork.Repository<LocationReview>();
        _checkInRepository = unitOfWork.Repository<LocationCheckIn>();
        _savedLocationRepository = unitOfWork.Repository<SavedLocation>();
    }

    #region Location Query Operations

    public async Task<MapLocationDto?> GetByIdAsync(Guid id, Guid? currentUserId = null)
    {
        var locations = await _locationRepository.GetWithIncludesAsync(
            l => l.Id == id,
            l => l.AddedBy
        );

        if (!locations.Any()) return null;

        var location = locations.First();
        var isSaved = currentUserId.HasValue &&
            await _savedLocationRepository.AnyAsync(s => s.LocationId == id && s.UserId == currentUserId.Value);

        return MapMapper.ToDto(location, isSaved);
    }

    public async Task<MapLocationDto?> GetBySlugAsync(string slug, Guid? currentUserId = null)
    {
        var locations = await _locationRepository.GetWithIncludesAsync(
            l => l.Slug == slug,
            l => l.AddedBy
        );

        if (!locations.Any()) return null;

        var location = locations.First();
        var isSaved = currentUserId.HasValue &&
            await _savedLocationRepository.AnyAsync(s => s.LocationId == location.Id && s.UserId == currentUserId.Value);

        return MapMapper.ToDto(location, isSaved);
    }

    public async Task<PagedResult<MapLocationListDto>> GetLocationsAsync(
        LocationFilter filter,
        int page = 1,
        int pageSize = 20)
    {
        var query = _locationRepository.AsQueryable()
            .Where(l => l.Status == LocationStatus.Active);

        if (filter.Type.HasValue)
            query = query.Where(l => l.Type == filter.Type.Value);

        if (!string.IsNullOrEmpty(filter.City))
            query = query.Where(l => l.City == filter.City);

        if (!string.IsNullOrEmpty(filter.Country))
            query = query.Where(l => l.Country == filter.Country);

        if (filter.MinRating.HasValue)
            query = query.Where(l => l.AverageRating >= filter.MinRating.Value);

        if (filter.IsVerified.HasValue)
            query = query.Where(l => l.IsVerified == filter.IsVerified.Value);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(l =>
                l.Name.Contains(filter.SearchTerm) ||
                l.Description.Contains(filter.SearchTerm));

        query = filter.SortBy switch
        {
            "rating" => query.OrderByDescending(l => l.AverageRating),
            "reviews" => query.OrderByDescending(l => l.ReviewCount),
            _ => query.OrderByDescending(l => l.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<MapLocationListDto>(
            items.Select(MapMapper.ToListDto).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<IEnumerable<MapLocationListDto>> GetNearbyLocationsAsync(NearbySearchRequest request)
    {
        var locations = await _locationRepository.GetAsync(l =>
            l.Status == LocationStatus.Active);

        var nearby = locations.Where(l =>
        {
            var latDiff = Math.Abs(l.Latitude - request.Latitude);
            var lngDiff = Math.Abs(l.Longitude - request.Longitude);
            var distance = Math.Sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
            return distance <= request.RadiusKm;
        });

        if (request.Type.HasValue)
            nearby = nearby.Where(l => l.Type == request.Type.Value);

        if (request.MinRating.HasValue)
            nearby = nearby.Where(l => l.AverageRating >= request.MinRating.Value);

        return nearby
            .OrderBy(l => Math.Sqrt(
                Math.Pow(l.Latitude - request.Latitude, 2) +
                Math.Pow(l.Longitude - request.Longitude, 2)))
            .Take(20)
            .Select(MapMapper.ToListDto);
    }

    public async Task<IEnumerable<MapLocationListDto>> SearchLocationsAsync(
        string query,
        LocationType? type = null,
        int count = 20)
    {
        var locationsQuery = _locationRepository.AsQueryable()
            .Where(l => l.Status == LocationStatus.Active &&
                       (l.Name.Contains(query) || l.Description.Contains(query)));

        if (type.HasValue)
            locationsQuery = locationsQuery.Where(l => l.Type == type.Value);

        var locations = await locationsQuery
            .OrderByDescending(l => l.AverageRating)
            .Take(count)
            .ToListAsync();

        return locations.Select(MapMapper.ToListDto);
    }

    #endregion

    #region Location Command Operations

    public async Task<MapLocationDto> CreateAsync(Guid? userId, CreateLocationRequest request)
    {
        var location = new MapLocation
        {
            Name = request.Name,
            Description = request.Description,
            Type = request.Type,
            Address = request.Address,
            City = request.City,
            Country = request.Country,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Phone = request.Phone,
            Website = request.Website,
            OpeningHours = request.OpeningHours,
            IsOpen24Hours = request.IsOpen24Hours,
            AddedById = userId,
            Status = LocationStatus.Active,
            Slug = SlugHelper.GenerateSlug(request.Name)
        };

        await _locationRepository.AddAsync(location);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(location.Id, userId))!;
    }

    public async Task<MapLocationDto> UpdateAsync(Guid locationId, Guid userId, UpdateLocationRequest request)
    {
        var location = await _locationRepository.FirstOrDefaultAsync(
            l => l.Id == locationId && l.AddedById == userId)
            ?? throw new InvalidOperationException("Location not found or unauthorized");

        if (request.Name != null)
        {
            location.Name = request.Name;
            location.Slug = SlugHelper.GenerateSlug(request.Name);
        }

        if (request.Description != null) location.Description = request.Description;
        if (request.Address != null) location.Address = request.Address;
        if (request.Phone != null) location.Phone = request.Phone;
        if (request.Website != null) location.Website = request.Website;
        if (request.OpeningHours != null) location.OpeningHours = request.OpeningHours;
        if (request.IsOpen24Hours.HasValue) location.IsOpen24Hours = request.IsOpen24Hours.Value;
        if (request.Status.HasValue) location.Status = request.Status.Value;

        _locationRepository.Update(location);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(locationId, userId))!;
    }

    public async Task<bool> DeleteAsync(Guid locationId, Guid userId)
    {
        var location = await _locationRepository.FirstOrDefaultAsync(
            l => l.Id == locationId && l.AddedById == userId);

        if (location == null) return false;

        _locationRepository.Delete(location);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Review Operations

    public async Task<PagedResult<LocationReviewDto>> GetReviewsAsync(
        Guid locationId,
        int page = 1,
        int pageSize = 20)
    {
        var query = _reviewRepository.AsQueryable()
            .Where(r => r.LocationId == locationId)
            .Include(r => r.Author)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<LocationReviewDto>(
            items.Select(r => new LocationReviewDto(
                r.Id,
                r.AuthorId,
                r.Author?.UserName ?? "Unknown",
                r.Author?.AvatarUrl,
                r.Rating,
                r.Title,
                r.Content,
                r.ServiceRating,
                r.PriceRating,
                r.CleanlinessRating,
                [],
                r.HelpfulCount,
                r.VisitDate,
                r.OwnerResponse,
                r.OwnerResponseAt,
                r.CreatedAt
            )).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    public async Task<LocationReviewDto> AddReviewAsync(
        Guid locationId,
        Guid userId,
        CreateLocationReviewRequest request)
    {
        var review = new LocationReview
        {
            LocationId = locationId,
            AuthorId = userId,
            Rating = request.Rating,
            Title = request.Title,
            Content = request.Content,
            ServiceRating = request.ServiceRating,
            PriceRating = request.PriceRating,
            CleanlinessRating = request.CleanlinessRating,
            VisitDate = request.VisitDate
        };

        await _reviewRepository.AddAsync(review);
        await UpdateLocationRating(locationId);
        await _unitOfWork.SaveChangesAsync();

        return new LocationReviewDto(
            review.Id,
            review.AuthorId,
            "User",
            null,
            review.Rating,
            review.Title,
            review.Content,
            review.ServiceRating,
            review.PriceRating,
            review.CleanlinessRating,
            [],
            0,
            review.VisitDate,
            null,
            null,
            review.CreatedAt
        );
    }

    public async Task<LocationReviewDto> UpdateReviewAsync(
        Guid reviewId,
        Guid userId,
        CreateLocationReviewRequest request)
    {
        var review = await _reviewRepository.FirstOrDefaultAsync(
            r => r.Id == reviewId && r.AuthorId == userId)
            ?? throw new InvalidOperationException("Review not found or unauthorized");

        review.Rating = request.Rating;
        review.Title = request.Title;
        review.Content = request.Content;
        review.ServiceRating = request.ServiceRating;
        review.PriceRating = request.PriceRating;
        review.CleanlinessRating = request.CleanlinessRating;
        review.UpdatedAt = DateTime.UtcNow;

        _reviewRepository.Update(review);
        await UpdateLocationRating(review.LocationId);
        await _unitOfWork.SaveChangesAsync();

        return new LocationReviewDto(
            review.Id,
            review.AuthorId,
            "User",
            null,
            review.Rating,
            review.Title,
            review.Content,
            review.ServiceRating,
            review.PriceRating,
            review.CleanlinessRating,
            [],
            review.HelpfulCount,
            review.VisitDate,
            review.OwnerResponse,
            review.OwnerResponseAt,
            review.CreatedAt
        );
    }

    public async Task<bool> DeleteReviewAsync(Guid reviewId, Guid userId)
    {
        var review = await _reviewRepository.FirstOrDefaultAsync(
            r => r.Id == reviewId && r.AuthorId == userId);

        if (review == null) return false;

        var locationId = review.LocationId;
        _reviewRepository.Delete(review);
        await UpdateLocationRating(locationId);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> MarkReviewHelpfulAsync(Guid reviewId, Guid userId)
    {
        var review = await _reviewRepository.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null) return false;

        review.HelpfulCount++;
        _reviewRepository.Update(review);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RespondToReviewAsync(Guid reviewId, Guid ownerId, string response)
    {
        var review = await _reviewRepository.GetWithIncludesAsync(
            r => r.Id == reviewId,
            r => r.Location
        );

        if (!review.Any() || review.First().Location.AddedById != ownerId)
            return false;

        var reviewEntity = review.First();
        reviewEntity.OwnerResponse = response;
        reviewEntity.OwnerResponseAt = DateTime.UtcNow;

        _reviewRepository.Update(reviewEntity);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Check-in Operations

    public async Task<bool> CheckInAsync(Guid locationId, Guid userId, CheckInRequest request)
    {
        var checkIn = new LocationCheckIn
        {
            LocationId = locationId,
            UserId = userId,
            Note = request.Note,
            PhotoUrl = request.PhotoUrl
        };

        await _checkInRepository.AddAsync(checkIn);

        var location = await _locationRepository.FirstOrDefaultAsync(l => l.Id == locationId);
        if (location != null)
        {
            location.CheckInCount++;
            _locationRepository.Update(location);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<LocationCheckIn>> GetUserCheckInsAsync(Guid userId, int count = 20)
    {
        var checkIns = await _checkInRepository.GetWithIncludesAsync(
            c => c.UserId == userId,
            c => c.Location
        );

        return checkIns.OrderByDescending(c => c.CheckedInAt).Take(count);
    }

    #endregion

    #region Saved Locations

    public async Task<bool> SaveLocationAsync(
        Guid locationId,
        Guid userId,
        string? listName = null,
        string? note = null)
    {
        var existing = await _savedLocationRepository.FirstOrDefaultAsync(
            s => s.LocationId == locationId && s.UserId == userId);

        if (existing != null) return false;

        await _savedLocationRepository.AddAsync(new SavedLocation
        {
            LocationId = locationId,
            UserId = userId,
            ListName = listName,
            Note = note
        });

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnsaveLocationAsync(Guid locationId, Guid userId)
    {
        var saved = await _savedLocationRepository.FirstOrDefaultAsync(
            s => s.LocationId == locationId && s.UserId == userId);

        if (saved == null) return false;

        _savedLocationRepository.Delete(saved);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<PagedResult<MapLocationListDto>> GetSavedLocationsAsync(
        Guid userId,
        string? listName = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _savedLocationRepository.AsQueryable()
            .Include(s => s.Location)
            .Where(s => s.UserId == userId);

        if (!string.IsNullOrEmpty(listName))
        {
            query = query.Where(s => s.ListName == listName);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<MapLocationListDto>(
            items.Select(s => MapMapper.ToListDto(s.Location)).ToList(),
            totalCount,
            page,
            pageSize
        );
    }

    #endregion

    #region Verification

    public async Task<bool> ClaimLocationAsync(Guid locationId, Guid userId)
    {
        var location = await _locationRepository.FirstOrDefaultAsync(l => l.Id == locationId);
        if (location == null || location.ClaimedById != null) return false;

        location.ClaimedById = userId;
        location.IsClaimedByOwner = true;

        _locationRepository.Update(location);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> VerifyLocationAsync(Guid locationId, Guid adminId)
    {
        var location = await _locationRepository.FirstOrDefaultAsync(l => l.Id == locationId);
        if (location == null) return false;

        location.IsVerified = true;

        _locationRepository.Update(location);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    #endregion

    #region Helper Methods

    private async Task UpdateLocationRating(Guid locationId)
    {
        var reviews = await _reviewRepository.GetAsync(r => r.LocationId == locationId);
        var location = await _locationRepository.FirstOrDefaultAsync(l => l.Id == locationId);

        if (location != null)
        {
            var reviewList = reviews.ToList();
            location.ReviewCount = reviewList.Count;
            location.AverageRating = reviewList.Any() ? (decimal)reviewList.Average(r => r.Rating) : 0;
            _locationRepository.Update(location);
        }
    }

    #endregion
}
