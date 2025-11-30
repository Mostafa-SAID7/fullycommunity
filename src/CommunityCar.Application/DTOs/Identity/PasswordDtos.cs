namespace CommunityCar.Application.DTOs.Identity;

public record ForgotPasswordRequest(string Email, string? ResetUrl = null);

public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword
);

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
);
