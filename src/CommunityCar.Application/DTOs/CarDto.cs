namespace CommunityCar.Application.DTOs;

public record CarDto(
    Guid Id,
    string Make,
    string Model,
    int Year,
    string LicensePlate,
    string? Description,
    decimal PricePerDay,
    string? ImageUrl,
    bool IsAvailable,
    string Location,
    Guid OwnerId
);

public record CreateCarDto(
    string Make,
    string Model,
    int Year,
    string LicensePlate,
    string? Description,
    decimal PricePerDay,
    string? ImageUrl,
    string Location
);

public record UpdateCarDto(
    string? Description,
    decimal? PricePerDay,
    string? ImageUrl,
    bool? IsAvailable,
    string? Location
);
