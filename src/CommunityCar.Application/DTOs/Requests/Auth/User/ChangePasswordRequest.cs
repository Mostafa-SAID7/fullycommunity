namespace CommunityCar.Application.DTOs.Requests.Auth.User;

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
);
