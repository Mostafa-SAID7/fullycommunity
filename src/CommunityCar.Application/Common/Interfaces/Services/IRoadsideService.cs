using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Services.Roadside;
using CommunityCar.Application.DTOs.Response.Services.Roadside;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IRoadsideService
{
    // Providers
    Task<RoadsideProviderDto?> GetProviderByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<NearbyRoadsideProviderDto>> FindNearbyProvidersAsync(FindNearbyProvidersRequest request, CancellationToken ct = default);
    Task<RoadsideProviderDto> RegisterProviderAsync(Guid userId, RoadsideProviderDto provider, CancellationToken ct = default);
    Task UpdateProviderStatusAsync(Guid id, Domain.Entities.Services.Roadside.RoadsideProviderStatus status, CancellationToken ct = default);
    Task UpdateProviderLocationAsync(Guid id, ProviderLocationUpdateRequest request, CancellationToken ct = default);
    
    // Assistance Requests
    Task<RoadsideAssistanceDto?> GetAssistanceByIdAsync(Guid id, CancellationToken ct = default);
    Task<RoadsideAssistanceDto?> GetAssistanceByCaseNumberAsync(string caseNumber, CancellationToken ct = default);
    Task<PagedResult<RoadsideAssistanceDto>> GetCustomerAssistanceHistoryAsync(Guid customerId, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<RoadsideAssistanceDto>> GetProviderAssistanceHistoryAsync(Guid providerId, int page, int pageSize, CancellationToken ct = default);
    
    // SOS
    Task<SOSResponse> CreateSOSRequestAsync(Guid customerId, SOSRequest request, CancellationToken ct = default);
    Task<RoadsideAssistanceDto> CreateAssistanceRequestAsync(Guid customerId, CreateRoadsideAssistanceRequest request, CancellationToken ct = default);
    
    // Assignment & Status
    Task<RoadsideAssistanceDto> AssignProviderAsync(Guid assistanceId, AssignProviderRequest request, CancellationToken ct = default);
    Task<RoadsideAssistanceDto> UpdateAssistanceStatusAsync(Guid id, UpdateAssistanceStatusRequest request, CancellationToken ct = default);
    Task<RoadsideAssistanceDto> ResolveAssistanceAsync(Guid id, string resolutionNotes, decimal finalCost, CancellationToken ct = default);
    Task CancelAssistanceAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Tracking
    Task<(double Latitude, double Longitude, int ETAMinutes)?> GetProviderLocationAsync(Guid assistanceId, CancellationToken ct = default);
    
    // Rating
    Task RateAssistanceAsync(Guid id, int rating, string? reviewText, CancellationToken ct = default);
}
