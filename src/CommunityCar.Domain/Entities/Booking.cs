namespace CommunityCar.Domain.Entities;

public class Booking : BaseEntity
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    
    public Guid CarId { get; set; }
    public Car Car { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    InProgress,
    Completed,
    Cancelled
}
