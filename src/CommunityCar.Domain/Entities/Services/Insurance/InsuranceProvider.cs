using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Insurance;

/// <summary>
/// Insurance company partner
/// </summary>
public class InsuranceProvider : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    
    // Contact
    public string Phone { get; set; } = string.Empty;
    public string? ClaimsPhone { get; set; }
    public string? Email { get; set; }
    
    // Coverage Types
    public bool OffersLiability { get; set; } = true;
    public bool OffersComprehensive { get; set; } = true;
    public bool OffersCollision { get; set; } = true;
    public bool OffersUninsuredMotorist { get; set; }
    public bool OffersRoadsideAssistance { get; set; }
    public bool OffersRentalReimbursement { get; set; }
    public bool OffersGapInsurance { get; set; }
    public bool OffersExtendedWarranty { get; set; }
    
    // Discounts
    public bool HasMultiCarDiscount { get; set; }
    public bool HasSafeDriverDiscount { get; set; }
    public bool HasGoodStudentDiscount { get; set; }
    public bool HasBundleDiscount { get; set; }
    public bool HasLoyaltyDiscount { get; set; }
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public double ClaimSettlementRatio { get; set; }
    public int AverageClaimProcessingDays { get; set; }
    
    // Partner Status
    public ProviderStatus Status { get; set; } = ProviderStatus.Active;
    public bool IsFeatured { get; set; }
    public int SortOrder { get; set; }
}
