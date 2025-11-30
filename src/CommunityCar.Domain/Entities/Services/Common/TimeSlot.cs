using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Services.Common;

/// <summary>
/// Time slot for booking availability
/// </summary>
public class TimeSlot : BaseEntity
{
    public Guid ProviderId { get; set; }
    public ServiceProvider Provider { get; set; } = null!;
    
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    
    public TimeSlotStatus Status { get; set; } = TimeSlotStatus.Available;
    
    public int MaxBookings { get; set; } = 1;
    public int CurrentBookings { get; set; }
    
    public decimal? SpecialPrice { get; set; }
    public bool IsPeakHour { get; set; }
    
    public Guid? BookingId { get; set; }
    public Booking? Booking { get; set; }
}
