using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Videos.LiveStream;

public class LiveStreamGift : BaseEntity
{
    public Guid LiveStreamId { get; set; }
    public LiveStream LiveStream { get; set; } = null!;
    
    public Guid SenderId { get; set; }
    public ApplicationUser Sender { get; set; } = null!;
    
    public Guid GiftTypeId { get; set; }
    public GiftType GiftType { get; set; } = null!;
    
    public int Quantity { get; set; } = 1;
    public decimal TotalValue { get; set; }
    public string? Message { get; set; }
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}

public class GiftType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string IconUrl { get; set; } = string.Empty;
    public string? AnimationUrl { get; set; }
    
    public decimal Price { get; set; }
    public string Currency { get; set; } = "USD";
    public int CoinsRequired { get; set; }
    
    public bool IsActive { get; set; } = true;
    public bool IsLimited { get; set; }
    public int SortOrder { get; set; }
}
