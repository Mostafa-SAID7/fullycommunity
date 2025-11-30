using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Marketplace.Common;

public class SavedSearch : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string SearchQueryJson { get; set; } = string.Empty;
    
    public MarketplaceCategory? Category { get; set; }
    public string? Keywords { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Location { get; set; }
    
    public bool NotifyOnNewListings { get; set; }
    public bool NotifyDaily { get; set; }
    public bool NotifyWeekly { get; set; }
    
    public DateTime? LastNotifiedAt { get; set; }
    public int NewListingsCount { get; set; }
}
