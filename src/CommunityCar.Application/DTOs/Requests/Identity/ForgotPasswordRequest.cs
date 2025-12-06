namespace CommunityCar.Application.DTOs.Requests.Identity;

public record ForgotPasswordRequest(string Email, string? ResetUrl = null);
