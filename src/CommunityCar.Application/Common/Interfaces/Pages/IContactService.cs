using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Pages;
using CommunityCar.Application.DTOs.Requests.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Common.Interfaces.Pages;

public interface IContactService
{
    // Submissions
    Task<ContactSubmissionDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<ContactSubmissionDto>> SearchAsync(ContactSearchRequest request, CancellationToken ct = default);
    Task<ContactSubmissionDto> SubmitAsync(CreateContactRequest request, Guid? userId, string? ipAddress, string? userAgent, CancellationToken ct = default);
    Task<ContactSubmissionDto> UpdateStatusAsync(Guid id, ContactStatus status, string? notes, CancellationToken ct = default);
    Task<ContactSubmissionDto> AssignAsync(Guid id, Guid assignedToId, CancellationToken ct = default);
    Task<ContactSubmissionDto> RespondAsync(Guid id, string response, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    
    // Stats
    Task<ContactStatsDto> GetStatsAsync(CancellationToken ct = default);
}
