using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Customer testimonial/review
/// </summary>
public class Testimonial : BaseEntity
{
    public string AuthorName { get; set; } = string.Empty;
    public string? AuthorTitle { get; set; }
    public string? AuthorCompany { get; set; }
    public string? AuthorPhotoUrl { get; set; }
    
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    
    public string? VideoUrl { get; set; }
    public string? SourceUrl { get; set; }
    public string? Source { get; set; }
    
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsVerified { get; set; }
}
