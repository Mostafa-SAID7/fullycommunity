namespace CommunityCar.Domain.Entities.Community.Maps;

public class LocationReviewMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LocationReviewId { get; set; }
    public LocationReview LocationReview { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
