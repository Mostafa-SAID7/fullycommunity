namespace CommunityCar.Application.DTOs.Requests.Auth.User;

public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword
);
