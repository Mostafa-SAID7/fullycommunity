using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Podcasts.Live;

/// <summary>
/// Tip/donation during live podcast recording
/// </summary>
public class LiveRecordingTip : BaseEntity
{
    public Guid LiveRecordingId { get; set; }
    public LiveRecording LiveRecording { get; set; } = null!;
    
    public Guid SenderId { get; set; }
    public ApplicationUser Sender { get; set; } = null!;
    
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string? Message { get; set; }
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    
    // Display
    public bool IsHighlighted { get; set; }
    public bool WasReadOnAir { get; set; }
    
    // Payment
    public string? PaymentId { get; set; }
    public string? PaymentStatus { get; set; }
}
