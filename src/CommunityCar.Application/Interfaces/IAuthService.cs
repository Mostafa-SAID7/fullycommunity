using CommunityCar.Application.DTOs;

namespace CommunityCar.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
}
