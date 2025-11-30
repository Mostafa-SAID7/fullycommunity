namespace CommunityCar.Application.DTOs.Identity;

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber = null,
    string? UserType = null
);
