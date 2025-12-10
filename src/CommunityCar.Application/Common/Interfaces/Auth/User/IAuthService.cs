using CommunityCar.Application.DTOs.Requests.Auth.User; using CommunityCar.Application.DTOs.Response.Auth.User;
using CommunityCar.Application.DTOs.Requests.Auth.Common; using CommunityCar.Application.DTOs.Response.Auth.Common;

namespace CommunityCar.Application.Common.Interfaces.Auth.User;

public interface IAuthService
{
    // Login
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<LoginResponse> TwoFactorLoginAsync(TwoFactorLoginRequest request);
    Task<LoginResponse> ExternalLoginAsync(ExternalLoginRequest request);

    // Register
    Task<LoginResponse> RegisterAsync(RegisterRequest request);


}
