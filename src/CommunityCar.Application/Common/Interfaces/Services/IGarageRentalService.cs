using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Services.Common;
using CommunityCar.Application.Features.Services.GarageRentals;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IGarageRentalService
{
    // Garages
    Task<GarageDto?> GetGarageByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<GarageDto>> SearchGaragesAsync(GarageSearchRequest request, CancellationToken ct = default);
    Task<GarageDto> CreateGarageAsync(Guid ownerId, CreateGarageRequest request, CancellationToken ct = default);
    Task<GarageDto> UpdateGarageAsync(Guid id, UpdateGarageRequest request, CancellationToken ct = default);
    Task DeleteGarageAsync(Guid id, CancellationToken ct = default);
    
    // Availability
    Task<List<GarageAvailabilityDto>> GetAvailabilityAsync(GarageAvailabilityRequest request, CancellationToken ct = default);
    Task<List<TimeSlotDto>> GetTimeSlotsAsync(Guid garageId, DateTime date, CancellationToken ct = default);
    
    // Bookings
    Task<GarageBookingDto?> GetBookingByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<GarageBookingDto>> GetRenterBookingsAsync(Guid renterId, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<GarageBookingDto>> GetOwnerBookingsAsync(Guid ownerId, int page, int pageSize, CancellationToken ct = default);
    Task<GarageBookingDto> CreateBookingAsync(Guid renterId, CreateGarageBookingRequest request, CancellationToken ct = default);
    Task<GarageBookingDto> ConfirmBookingAsync(Guid id, CancellationToken ct = default);
    Task<GarageBookingDto> CheckInAsync(Guid id, CancellationToken ct = default);
    Task<GarageBookingDto> CheckOutAsync(Guid id, CancellationToken ct = default);
    Task CancelBookingAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Smart Lock
    Task<string> GenerateAccessCodeAsync(Guid bookingId, CancellationToken ct = default);
    Task RevokeAccessCodeAsync(Guid bookingId, CancellationToken ct = default);
}
