namespace CommunityCar.Application.DTOs.Requests.Identity;

public record UpdateProfileRequest(
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? Bio,
    DateTime? Birthday,
    string? Location,
    string? ThemeColor,
    string? PreferredLanguage
);
