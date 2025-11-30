using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Services.Maintenance;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IMaintenanceService
{
    // Workshops
    Task<WorkshopDto?> GetWorkshopByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<WorkshopDto>> SearchWorkshopsAsync(WorkshopSearchRequest request, CancellationToken ct = default);
    Task<WorkshopDto> CreateWorkshopAsync(Guid userId, CreateWorkshopRequest request, CancellationToken ct = default);
    Task<WorkshopDto> UpdateWorkshopAsync(Guid id, CreateWorkshopRequest request, CancellationToken ct = default);
    Task DeleteWorkshopAsync(Guid id, CancellationToken ct = default);
    
    // Workshop Services
    Task<List<WorkshopServiceDto>> GetWorkshopServicesAsync(Guid workshopId, CancellationToken ct = default);
    Task<WorkshopServiceDto> AddWorkshopServiceAsync(Guid workshopId, WorkshopServiceDto service, CancellationToken ct = default);
    Task DeleteWorkshopServiceAsync(Guid workshopId, Guid serviceId, CancellationToken ct = default);
    
    // Mechanics
    Task<List<MechanicDto>> GetMechanicsAsync(Guid workshopId, CancellationToken ct = default);
    Task<MechanicDto> AddMechanicAsync(Guid workshopId, MechanicDto mechanic, CancellationToken ct = default);
    
    // Bookings
    Task<MaintenanceBookingDto?> GetBookingByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<MaintenanceBookingDto>> GetCustomerBookingsAsync(Guid customerId, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<MaintenanceBookingDto>> GetWorkshopBookingsAsync(Guid workshopId, int page, int pageSize, CancellationToken ct = default);
    Task<MaintenanceBookingDto> CreateBookingAsync(Guid customerId, CreateMaintenanceBookingRequest request, CancellationToken ct = default);
    Task<MaintenanceBookingDto> UpdateBookingStatusAsync(Guid id, UpdateMaintenanceStatusRequest request, CancellationToken ct = default);
    Task CancelBookingAsync(Guid id, string reason, CancellationToken ct = default);
    
    // AI Recommendations
    Task<List<AIWorkshopRecommendationDto>> GetAIRecommendationsAsync(AIWorkshopRecommendationRequest request, CancellationToken ct = default);
}
