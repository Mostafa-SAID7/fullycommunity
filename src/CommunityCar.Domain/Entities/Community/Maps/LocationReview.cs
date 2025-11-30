using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Maps;

public class LocationReview
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid LocationId { get; set; }
    public MapLocation Location { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    
    public int Rating { get; set; } // 1-5
    public string? Title { get; set; }
    public string? Content { get; set; }
    
    // Detailed ratings
    public int? ServiceRating { get; set; }
    public int? PriceRating { get; set; }
    public int? CleanlinessRating { get; set; }
    
    // Media
    public List<ReviewMedia> Media { get; set; } = [];
    
    // Engagement
    public int HelpfulCount { get; set; }
    public int ReportCount { get; set; }
    
    // Visit info
    public DateTime? VisitDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Owner response
    public string? OwnerResponse { get; set; }
    public DateTime? OwnerResponseAt { get; set; }
}

public class ReviewMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ReviewId { get; set; }
    public LocationReview Review { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class LocationCheckIn
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid LocationId { get; set; }
    public MapLocation Location { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string? Note { get; set; }
    public string? PhotoUrl { get; set; }
    
    public DateTime CheckedInAt { get; set; } = DateTime.UtcNow;
}

public class SavedLocation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid LocationId { get; set; }
    public MapLocation Location { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string? ListName { get; set; } // e.g., "Favorites", "Want to Visit"
    public string? Note { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
