using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Version history for legal documents
/// </summary>
public class LegalDocumentVersion : BaseEntity
{
    public Guid LegalDocumentId { get; set; }
    public LegalDocument LegalDocument { get; set; } = null!;
    
    public string Version { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ChangeLog { get; set; }
    
    public DateTime EffectiveDate { get; set; }
    
    public Guid? AuthorId { get; set; }
    public ApplicationUser? Author { get; set; }
}
