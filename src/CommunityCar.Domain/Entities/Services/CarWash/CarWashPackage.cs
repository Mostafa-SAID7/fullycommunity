using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.CarWash;

public class CarWashPackage : BaseEntity
{
    public Guid CarWashProviderId { get; set; }
    public CarWashProvider CarWashProvider { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public PackageTier Tier { get; set; }
    
    // Services Included
    public bool IncludesExteriorWash { get; set; } = true;
    public bool IncludesInteriorVacuum { get; set; }
    public bool IncludesWindowCleaning { get; set; }
    public bool IncludesTireShine { get; set; }
    public bool IncludesWax { get; set; }
    public bool IncludesInteriorWipe { get; set; }
    public bool IncludesAirFreshener { get; set; }
    public bool IncludesEngineWash { get; set; }
    public bool IncludesLeatherConditioning { get; set; }
    public bool IncludesCeramicCoating { get; set; }
    
    // Pricing
    public decimal PriceSedanSUV { get; set; }
    public decimal? PriceTruck { get; set; }
    public decimal? PriceVan { get; set; }
    public decimal? PriceMotorcycle { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Duration
    public int EstimatedDurationMins { get; set; }
    
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}

public enum PackageTier { Basic, Standard, Premium, Ultimate }
