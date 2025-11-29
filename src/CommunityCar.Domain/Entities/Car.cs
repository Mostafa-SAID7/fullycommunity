namespace CommunityCar.Domain.Entities;

public class Car : BaseEntity
{
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal PricePerDay { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string Location { get; set; } = string.Empty;
    
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
