namespace CommunityCar.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsActive { get; set; } = true;
    
    public ICollection<Car> Cars { get; set; } = new List<Car>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
