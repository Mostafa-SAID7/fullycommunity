using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Services.Registration;
using CommunityCar.Application.DTOs.Response.Services.Registration;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IRegistrationService
{
    // Services
    Task<RegistrationServiceDto?> GetServiceByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<RegistrationServiceDto>> SearchServicesAsync(RegistrationServiceSearchRequest request, CancellationToken ct = default);
    Task<List<RegistrationFeeDto>> GetFeesAsync(Guid serviceId, CancellationToken ct = default);
    
    // Requests
    Task<RegistrationRequestDto?> GetRequestByIdAsync(Guid id, CancellationToken ct = default);
    Task<RegistrationRequestDto?> GetRequestByNumberAsync(string requestNumber, CancellationToken ct = default);
    Task<PagedResult<RegistrationRequestDto>> GetCustomerRequestsAsync(Guid customerId, int page, int pageSize, CancellationToken ct = default);
    Task<RegistrationRequestDto> CreateRequestAsync(Guid customerId, CreateRegistrationRequestRequest request, CancellationToken ct = default);
    Task<RegistrationRequestDto> UpdateRequestStatusAsync(Guid id, UpdateRequestStatusRequest request, CancellationToken ct = default);
    Task SubmitRequestAsync(Guid id, CancellationToken ct = default);
    Task CancelRequestAsync(Guid id, string reason, CancellationToken ct = default);
    
    // Documents
    Task<List<RegistrationDocumentDto>> GetRequiredDocumentsAsync(Domain.Entities.Services.Registration.RegistrationType type, CancellationToken ct = default);
    Task<List<RegistrationDocumentDto>> GetRequestDocumentsAsync(Guid requestId, CancellationToken ct = default);
    Task<RegistrationDocumentDto> UploadDocumentAsync(UploadDocumentRequest request, CancellationToken ct = default);
    Task VerifyDocumentAsync(Guid documentId, bool isVerified, string? notes, CancellationToken ct = default);
    
    // Reminders
    Task<List<RegistrationReminderDto>> GetUserRemindersAsync(Guid userId, CancellationToken ct = default);
    Task<RegistrationReminderDto> CreateReminderAsync(Guid userId, CreateReminderRequest request, CancellationToken ct = default);
    Task UpdateReminderAsync(Guid id, CreateReminderRequest request, CancellationToken ct = default);
    Task DeleteReminderAsync(Guid id, CancellationToken ct = default);
    Task MarkReminderCompletedAsync(Guid id, CancellationToken ct = default);
}
