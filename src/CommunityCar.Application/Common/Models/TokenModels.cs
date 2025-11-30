namespace CommunityCar.Application.Common.Models;

public record TokenResult(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpires,
    DateTime RefreshTokenExpires
);
