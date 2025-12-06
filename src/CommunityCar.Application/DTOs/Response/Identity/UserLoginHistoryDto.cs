namespace CommunityCar.Application.DTOs.Response.Identity;

public record UserLoginHistoryDto(
    Guid Id,
    string? IpAddress,
    string? Country,
    string? City,
    string? Browser,
    string? Platform,
    bool IsSuccessful,
    DateTime LoginAt
);
