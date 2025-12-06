namespace CommunityCar.Application.DTOs.Requests.Identity;

public record UpdateUserRequest(
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? UserType,
    bool? IsActive,
    bool? IsVerified
);
