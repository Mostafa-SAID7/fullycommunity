using CommunityCar.Application.DTOs;

namespace CommunityCar.Application.Interfaces;

public interface IBookingService
{
    Task<IEnumerable<BookingDto>> GetUserBookingsAsync(Guid userId);
    Task<BookingDto?> GetBookingByIdAsync(Guid id);
    Task<BookingDto> CreateBookingAsync(CreateBookingDto dto, Guid userId);
    Task<bool> CancelBookingAsync(Guid id, Guid userId);
}
