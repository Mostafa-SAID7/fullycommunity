using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Legal documents (Terms, Privacy, etc.)
/// </summary>
public class LegalDocument : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public LegalDocumentType Type { get; set; }
    
    public string Content { get; set; } = string.Empty;
    public string? Summary { get; set; }
    
    public string Version { get; set; } = "1.0";
    public DateTime EffectiveDate { get; set; }
    public DateTime? ExpiresAt { get; set; }
    
    public bool IsPublished { get; set; } = true;
    public bool RequiresAcceptance { get; set; }
    
    public Guid? AuthorId { get; set; }
    public ApplicationUser? Author { get; set; }
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    
    // Navigation
    public List<LegalDocumentVersion> Versions { get; set; } = [];
}

public enum LegalDocumentType
{
    TermsOfService,
    PrivacyPolicy,
    CookiePolicy,
    AcceptableUsePolicy,
    RefundPolicy,
    DMCA,
    GDPR,
    CCPA,
    Disclaimer,
    CommunityGuidelines,
    DataProcessingAgreement,
    ServiceLevelAgreement,
    Other
}
