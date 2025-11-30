using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Partner/sponsor for About page
/// </summary>
public class Partner : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    
    public PartnerType Type { get; set; } = PartnerType.Partner;
    public PartnerTier Tier { get; set; } = PartnerTier.Standard;
    
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    
    public DateTime? PartnershipStartDate { get; set; }
    public DateTime? PartnershipEndDate { get; set; }
}

public enum PartnerType { Partner, Sponsor, Investor, Integration, Media }
public enum PartnerTier { Standard, Silver, Gold, Platinum, Diamond }
