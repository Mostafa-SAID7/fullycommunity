using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Services.Common;

/// <summary>
/// Review for service providers
/// </summary>
public class ServiceReview : BaseEntity
{
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    
    public Guid? BookingId { get; set; }
    public Booking? Booking { get; set; }
    
    public int OverallRating { get; set; }
    public int? QualityRating { get; set; }
    public int? TimelinessRating { get; set; }
    public int? CommunicationRating { get; set; }
    public int? ValueRating { get; set; }
    
    public string? Title { get; set; }
    public string? Comment { get; set; }
    
    public List<string> PhotoUrls { get; set; } = [];
    
    public bool IsVerifiedPurchase { get; set; }
    public bool IsRecommended { get; set; }
    
    // Provider response
    public string? ProviderResponse { get; set; }
    public DateTime? RespondedAt { get; set; }
    
    // Moderation
    public bool IsApproved { get; set; } = true;
    public bool IsFlagged { get; set; }
    public string? FlagReason { get; set; }
    
    // Helpfulness
    public int HelpfulCount { get; set; }
    public int NotHelpfulCount { get; set; }
}
