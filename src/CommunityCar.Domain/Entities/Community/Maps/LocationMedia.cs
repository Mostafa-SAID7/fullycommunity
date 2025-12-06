namespace CommunityCar.Domain.Entities.Community.Maps;

public class LocationMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LocationId { get; set; }
    public MapLocation Location { get; set; } = null!;
    public Guid? UploadedById { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
