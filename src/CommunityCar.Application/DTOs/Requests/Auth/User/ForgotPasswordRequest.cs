namespace CommunityCar.Application.DTOs.Requests.Auth.User;

public record ForgotPasswordRequest(string Email, string? ResetUrl = null);
