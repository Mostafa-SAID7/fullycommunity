using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// User acceptance of legal documents
/// </summary>
public class LegalAcceptance : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public Guid LegalDocumentId { get; set; }
    public LegalDocument LegalDocument { get; set; } = null!;
    
    public string AcceptedVersion { get; set; } = string.Empty;
    public DateTime AcceptedAt { get; set; } = DateTime.UtcNow;
    
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}
