namespace CommunityCar.Application.DTOs;

public record LoginDto(string Email, string Password);

public record RegisterDto(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber
);

public record AuthResponseDto(
    string Token,
    string RefreshToken,
    DateTime Expiration,
    UserDto User
);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber
);
