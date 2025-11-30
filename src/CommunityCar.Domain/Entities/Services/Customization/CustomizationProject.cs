using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Entities.Services.Common;

namespace CommunityCar.Domain.Entities.Services.Customization;

/// <summary>
/// Customization project (booking + portfolio item)
/// </summary>
public class CustomizationProject : BaseEntity
{
    public string ProjectNumber { get; set; } = string.Empty;
    
    public Guid ShopId { get; set; }
    public CustomizationShop Shop { get; set; } = null!;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    // Vehicle
    public string VehicleMake { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string? VehicleColor { get; set; }
    public string? LicensePlate { get; set; }
    
    // Project Details
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<CustomizationType> Types { get; set; } = [];
    public List<Guid> ServiceIds { get; set; } = [];
    
    // Media
    public List<string> BeforePhotoUrls { get; set; } = [];
    public List<string> AfterPhotoUrls { get; set; } = [];
    public List<string> ProgressPhotoUrls { get; set; } = [];
    public string? VideoUrl { get; set; }
    public string? RenderingUrl { get; set; }
    
    // Timeline
    public DateTime? ConsultationDate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EstimatedCompletion { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    // Status
    public ProjectStatus Status { get; set; } = ProjectStatus.Inquiry;
    public int ProgressPercent { get; set; }
    
    // Pricing
    public decimal EstimatedCost { get; set; }
    public decimal? FinalCost { get; set; }
    public decimal? DepositPaid { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    
    // Portfolio
    public bool ShowInPortfolio { get; set; }
    public bool IsFeatured { get; set; }
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    
    // Rating
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
}

public enum ProjectStatus { Inquiry, Consultation, QuoteProvided, Approved, InProgress, QualityCheck, Completed, Cancelled }
