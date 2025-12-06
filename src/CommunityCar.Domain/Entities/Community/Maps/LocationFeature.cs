namespace CommunityCar.Domain.Entities.Community.Maps;

public class LocationFeature
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LocationId { get; set; }
    public MapLocation Location { get; set; } = null!;
    public string Feature { get; set; } = string.Empty; // e.g., "WiFi", "EV Charging", "Air Pump"
}
