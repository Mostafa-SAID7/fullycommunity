using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Customization;

public class CustomizationService : BaseEntity
{
    public Guid ShopId { get; set; }
    public CustomizationShop Shop { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public CustomizationType Type { get; set; }
    
    // Pricing
    public decimal StartingPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public PricingType PricingType { get; set; } = PricingType.Quote;
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Duration
    public int EstimatedDays { get; set; }
    public int? MaxDays { get; set; }
    
    // Details
    public string? MaterialsUsed { get; set; }
    public string? ProcessDescription { get; set; }
    public List<string> SamplePhotoUrls { get; set; } = [];
    
    // Warranty
    public int WarrantyMonths { get; set; }
    public string? WarrantyTerms { get; set; }
    
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
}
