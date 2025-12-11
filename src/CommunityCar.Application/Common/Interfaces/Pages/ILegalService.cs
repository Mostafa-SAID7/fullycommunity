using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Pages;
using CommunityCar.Application.DTOs.Requests.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Common.Interfaces.Pages;

public interface ILegalService
{
    // Documents
    Task<LegalDocumentDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<LegalDocumentDto?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<LegalDocumentDto?> GetByTypeAsync(LegalDocumentType type, CancellationToken ct = default);
    Task<List<LegalDocumentListItemDto>> GetAllAsync(CancellationToken ct = default);
    
    Task<LegalDocumentDto> CreateAsync(CreateLegalDocumentRequest request, Guid authorId, CancellationToken ct = default);
    Task<LegalDocumentDto> UpdateAsync(Guid id, UpdateLegalDocumentRequest request, Guid authorId, CancellationToken ct = default);
    Task PublishAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    
    // Versions
    Task<List<LegalDocumentVersionDto>> GetVersionsAsync(Guid documentId, CancellationToken ct = default);
    Task<LegalDocumentVersionDto?> GetVersionAsync(Guid versionId, CancellationToken ct = default);
    
    // Acceptance
    Task<bool> HasAcceptedAsync(Guid userId, LegalDocumentType type, CancellationToken ct = default);
    Task<List<LegalAcceptanceDto>> GetUserAcceptancesAsync(Guid userId, CancellationToken ct = default);
    Task AcceptAsync(Guid userId, Guid documentId, string? ipAddress, string? userAgent, CancellationToken ct = default);
    Task<List<LegalDocumentType>> GetPendingAcceptancesAsync(Guid userId, CancellationToken ct = default);
}
