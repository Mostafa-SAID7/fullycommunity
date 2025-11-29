namespace CommunityCar.Application.DTOs;

public record BookingDto(
    Guid Id,
    DateTime StartDate,
    DateTime EndDate,
    decimal TotalPrice,
    string Status,
    Guid CarId,
    Guid UserId,
    DateTime CreatedAt
);

public record CreateBookingDto(
    Guid CarId,
    DateTime StartDate,
    DateTime EndDate
);
