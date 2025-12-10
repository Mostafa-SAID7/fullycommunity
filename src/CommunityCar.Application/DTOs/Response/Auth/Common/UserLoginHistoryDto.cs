namespace CommunityCar.Application.DTOs.Response.Auth.Common;

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
