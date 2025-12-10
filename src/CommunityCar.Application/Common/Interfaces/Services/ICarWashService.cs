using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Services.CarWash;
using CommunityCar.Application.DTOs.Response.Services.CarWash;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface ICarWashService
{
    // Providers
    Task<CarWashProviderDto?> GetProviderByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<CarWashProviderDto>> SearchProvidersAsync(CarWashSearchRequest request, CancellationToken ct = default);
    Task<CarWashProviderDto> CreateProviderAsync(CreateCarWashProviderRequest request, CancellationToken ct = default);
    Task<CarWashProviderDto> UpdateProviderAsync(Guid id, CreateCarWashProviderRequest request, CancellationToken ct = default);
    
    // Packages
    Task<List<CarWashPackageDto>> GetPackagesAsync(Guid providerId, CancellationToken ct = default);
    Task<CarWashPackageDto> CreatePackageAsync(CreateCarWashPackageRequest request, CancellationToken ct = default);
    Task<CarWashPackageDto> UpdatePackageAsync(Guid id, CreateCarWashPackageRequest request, CancellationToken ct = default);
    Task DeletePackageAsync(Guid id, CancellationToken ct = default);
    
    // Bookings
    Task<CarWashBookingDto?> GetBookingByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<CarWashBookingDto>> GetCustomerBookingsAsync(Guid customerId, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<CarWashBookingDto>> GetProviderBookingsAsync(Guid providerId, int page, int pageSize, CancellationToken ct = default);
    Task<CarWashBookingDto> CreateBookingAsync(Guid customerId, CreateCarWashBookingRequest request, CancellationToken ct = default);
    Task<CarWashBookingDto> ConfirmBookingAsync(Guid id, CancellationToken ct = default);
    Task<CarWashBookingDto> StartServiceAsync(Guid id, CancellationToken ct = default);
    Task<CarWashBookingDto> CompleteServiceAsync(Guid id, CancellationToken ct = default);
    Task CancelBookingAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Time Slots
    Task<List<TimeSlotDto>> GetAvailableSlotsAsync(Guid providerId, DateTime date, CancellationToken ct = default);
    
    // Rating
    Task RateServiceAsync(Guid bookingId, int rating, string? reviewText, CancellationToken ct = default);
}
