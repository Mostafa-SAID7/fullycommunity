using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.DrivingSchool;

public class DrivingPackage : BaseEntity
{
    public Guid SchoolId { get; set; }
    public DrivingSchool School { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public PackageLevel Level { get; set; }
    
    // Content
    public int TheoryHours { get; set; }
    public int PracticalHours { get; set; }
    public int SimulatorHours { get; set; }
    public bool IncludesOnlineTheory { get; set; }
    public bool IncludesTestPrep { get; set; }
    public bool IncludesTestBooking { get; set; }
    public bool IncludesPickupDropoff { get; set; }
    
    // Pricing
    public decimal Price { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    
    // Validity
    public int ValidityDays { get; set; } = 180;
    
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
}

public enum PackageLevel { Beginner, Intermediate, Advanced, Refresher, Commercial }
