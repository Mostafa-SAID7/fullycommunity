using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Services.Repairs;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IRepairService
{
    // Repair Requests
    Task<RepairRequestDto?> GetRequestByIdAsync(Guid id, CancellationToken ct = default);
    Task<RepairRequestDto?> GetRequestByNumberAsync(string requestNumber, CancellationToken ct = default);
    Task<PagedResult<RepairRequestDto>> GetCustomerRequestsAsync(Guid customerId, RepairSearchRequest request, CancellationToken ct = default);
    Task<PagedResult<RepairRequestDto>> GetProviderRequestsAsync(Guid providerId, RepairSearchRequest request, CancellationToken ct = default);
    Task<RepairRequestDto> CreateRequestAsync(Guid customerId, CreateRepairRequestRequest request, CancellationToken ct = default);
    Task<RepairRequestDto> UpdateRequestAsync(Guid id, CreateRepairRequestRequest request, CancellationToken ct = default);
    Task SubmitRequestAsync(Guid id, CancellationToken ct = default);
    Task CancelRequestAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Quotes
    Task<List<RepairQuoteDto>> GetQuotesForRequestAsync(Guid requestId, CancellationToken ct = default);
    Task<RepairQuoteDto?> GetQuoteByIdAsync(Guid id, CancellationToken ct = default);
    Task<RepairQuoteDto> CreateQuoteAsync(Guid providerId, CreateRepairQuoteRequest request, CancellationToken ct = default);
    Task<RepairRequestDto> AcceptQuoteAsync(Guid requestId, AcceptQuoteRequest request, CancellationToken ct = default);
    Task RejectQuoteAsync(Guid quoteId, string? reason, CancellationToken ct = default);
    
    // Status Updates
    Task<List<RepairStatusUpdateDto>> GetStatusUpdatesAsync(Guid requestId, CancellationToken ct = default);
    Task<RepairStatusUpdateDto> AddStatusUpdateAsync(Guid requestId, CreateRepairStatusUpdateRequest request, CancellationToken ct = default);
    
    // Completion
    Task<RepairRequestDto> CompleteRepairAsync(Guid id, decimal finalCost, CancellationToken ct = default);
    
    // Rating
    Task RateRepairAsync(Guid id, int rating, string? reviewText, CancellationToken ct = default);
}
