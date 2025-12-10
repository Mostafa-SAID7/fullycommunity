using CommunityCar.Application.DTOs.Requests.Auth.Admin;
using CommunityCar.Application.DTOs.Response.Auth.Admin;

namespace CommunityCar.Application.Common.Interfaces.Auth.Admin;

public interface IAdminAuthService
{
    Task<AdminAuthResponse> AdminLoginAsync(AdminLoginRequest request);
    Task<AdminAuthResponse> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync(Guid userId, string refreshToken);
    Task<AdminUserResponse> GetCurrentAdminUserAsync(Guid userId);
}
