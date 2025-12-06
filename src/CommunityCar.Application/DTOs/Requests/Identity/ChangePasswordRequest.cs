namespace CommunityCar.Application.DTOs.Requests.Identity;

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
);
