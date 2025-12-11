using CommunityCar.Application.DTOs.Requests.Auth.Common; using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.User;

namespace CommunityCar.Application.Common.Interfaces.Auth.Common;

public interface ICommonAuthService
{
    // Password Management
    Task ForgotPasswordAsync(ForgotPasswordRequest request);
    Task ResetPasswordAsync(ResetPasswordRequest request);
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request);

    // Token Management
    Task<LoginResponse> RefreshTokenAsync(RefreshTokenRequest request);
    Task RevokeTokenAsync(RevokeTokenRequest request);
    Task RevokeAllTokensAsync(Guid userId);

    // Session Management
    Task LogoutAsync(Guid userId, string? deviceId = null);
}
