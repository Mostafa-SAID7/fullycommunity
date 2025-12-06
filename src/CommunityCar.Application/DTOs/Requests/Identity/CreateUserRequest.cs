namespace CommunityCar.Application.DTOs.Requests.Identity;

public record CreateUserRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string UserType,
    IEnumerable<string>? Roles
);
