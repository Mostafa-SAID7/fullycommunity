using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Pages;

public class PageReview : BaseEntity
{
    public Guid PageId { get; set; }
    public Page Page { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public int Rating { get; set; } // 1-5 stars
    public string? Title { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = new();
    
    public int HelpfulCount { get; set; } = 0;
    public string? OwnerResponse { get; set; }
    public DateTime? OwnerResponseAt { get; set; }
}
