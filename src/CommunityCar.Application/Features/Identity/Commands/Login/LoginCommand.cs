using MediatR;

namespace CommunityCar.Application.Features.Identity.Commands.Login;

public record LoginCommand(
    string Email,
    string Password,
    string? DeviceId = null,
    bool RememberMe = false
) : IRequest<LoginResponse>;

public record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User,
    bool RequiresTwoFactor = false,
    bool RequiresVerification = false
);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    string UserType,
    bool IsVerified,
    IEnumerable<string> Roles
);
