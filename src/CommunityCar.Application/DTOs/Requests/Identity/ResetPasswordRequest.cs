namespace CommunityCar.Application.DTOs.Requests.Identity;

public record ResetPasswordRequest(
    string Email,
    string Token,
    string NewPassword
);
