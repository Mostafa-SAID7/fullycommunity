using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Services.Expert;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IExpertService
{
    // Experts
    Task<ExpertDto?> GetExpertByIdAsync(Guid id, CancellationToken ct = default);
    Task<ExpertDto?> GetExpertByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<PagedResult<ExpertDto>> SearchExpertsAsync(ExpertSearchRequest request, CancellationToken ct = default);
    Task<ExpertDto> CreateExpertProfileAsync(Guid userId, CreateExpertProfileRequest request, CancellationToken ct = default);
    Task<ExpertDto> UpdateExpertProfileAsync(Guid id, CreateExpertProfileRequest request, CancellationToken ct = default);
    Task UpdateExpertStatusAsync(Guid id, Domain.Entities.Services.Expert.ExpertStatus status, CancellationToken ct = default);
    
    // AI Triage
    Task<AITriageResultDto> PerformAITriageAsync(AITriageRequest request, CancellationToken ct = default);
    
    // Consultations
    Task<ConsultationDto?> GetConsultationByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<ConsultationDto>> GetCustomerConsultationsAsync(Guid customerId, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<ConsultationDto>> GetExpertConsultationsAsync(Guid expertId, int page, int pageSize, CancellationToken ct = default);
    Task<ConsultationDto> CreateConsultationAsync(Guid customerId, CreateConsultationRequest request, CancellationToken ct = default);
    Task<StartConsultationResponse> StartConsultationAsync(Guid id, CancellationToken ct = default);
    Task<ConsultationDto> EndConsultationAsync(Guid id, UpdateConsultationRequest request, CancellationToken ct = default);
    Task CancelConsultationAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Rating
    Task RateConsultationAsync(Guid id, int rating, string? reviewText, CancellationToken ct = default);
}
