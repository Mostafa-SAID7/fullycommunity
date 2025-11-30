using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Services.Inspection;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IInspectionService
{
    // Centers
    Task<InspectionCenterDto?> GetCenterByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<InspectionCenterDto>> SearchCentersAsync(InspectionSearchRequest request, CancellationToken ct = default);
    
    // Services
    Task<List<InspectionServiceDto>> GetServicesAsync(Guid centerId, CancellationToken ct = default);
    
    // Bookings
    Task<InspectionBookingDto?> GetBookingByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<InspectionBookingDto>> GetCustomerBookingsAsync(Guid customerId, int page, int pageSize, CancellationToken ct = default);
    Task<InspectionBookingDto> CreateBookingAsync(Guid customerId, CreateInspectionBookingRequest request, CancellationToken ct = default);
    Task<InspectionBookingDto> ConfirmBookingAsync(Guid id, CancellationToken ct = default);
    Task<InspectionBookingDto> StartInspectionAsync(Guid id, CancellationToken ct = default);
    Task CancelBookingAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Reports
    Task<InspectionReportDto?> GetReportByIdAsync(Guid id, CancellationToken ct = default);
    Task<InspectionReportDto?> GetReportByBookingIdAsync(Guid bookingId, CancellationToken ct = default);
    Task<List<InspectionReportDto>> GetVehicleHistoryAsync(string vin, CancellationToken ct = default);
    Task<InspectionReportDto> CreateReportAsync(CreateInspectionReportRequest request, CancellationToken ct = default);
    
    // AI Analysis
    Task<List<PredictiveMaintenanceDto>> GetPredictiveMaintenanceAsync(Guid reportId, CancellationToken ct = default);
    
    // Rating
    Task RateInspectionAsync(Guid bookingId, int rating, string? reviewText, CancellationToken ct = default);
}
