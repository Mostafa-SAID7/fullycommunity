using CommunityCar.Application.DTOs.Identity;

namespace CommunityCar.Application.Common.Interfaces;

public interface IAuthService
{
    // Login
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<LoginResponse> TwoFactorLoginAsync(TwoFactorLoginRequest request);
    Task<LoginResponse> ExternalLoginAsync(ExternalLoginRequest request);

    // Register
    Task<LoginResponse> RegisterAsync(RegisterRequest request);

    // Password
    Task ForgotPasswordAsync(ForgotPasswordRequest request);
    Task ResetPasswordAsync(ResetPasswordRequest request);
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request);

    // Token
    Task<LoginResponse> RefreshTokenAsync(RefreshTokenRequest request);
    Task RevokeTokenAsync(RevokeTokenRequest request);
    Task RevokeAllTokensAsync(Guid userId);

    // Logout
    Task LogoutAsync(Guid userId, string? deviceId = null);
}
