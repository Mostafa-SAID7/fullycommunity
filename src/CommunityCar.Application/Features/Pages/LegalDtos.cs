using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Features.Pages;

public record LegalDocumentDto(
    Guid Id,
    string Title,
    string Slug,
    LegalDocumentType Type,
    string Content,
    string? Summary,
    string Version,
    DateTime EffectiveDate,
    DateTime? ExpiresAt,
    bool RequiresAcceptance,
    string? AuthorName,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record LegalDocumentListItemDto(
    Guid Id,
    string Title,
    string Slug,
    LegalDocumentType Type,
    string Version,
    DateTime EffectiveDate,
    bool RequiresAcceptance,
    bool IsPublished
);

public record LegalDocumentVersionDto(
    Guid Id,
    string Version,
    string Content,
    string? ChangeLog,
    DateTime EffectiveDate,
    string? AuthorName,
    DateTime CreatedAt
);

public record LegalAcceptanceDto(
    Guid DocumentId,
    string DocumentTitle,
    LegalDocumentType DocumentType,
    string AcceptedVersion,
    DateTime AcceptedAt
);

public record CreateLegalDocumentRequest(
    string Title,
    LegalDocumentType Type,
    string Content,
    string? Summary,
    string Version,
    DateTime EffectiveDate,
    bool RequiresAcceptance,
    string? MetaTitle,
    string? MetaDescription
);

public record UpdateLegalDocumentRequest(
    string? Title,
    string? Content,
    string? Summary,
    string? Version,
    DateTime? EffectiveDate,
    DateTime? ExpiresAt,
    bool? RequiresAcceptance,
    string? ChangeLog,
    string? MetaTitle,
    string? MetaDescription
);
