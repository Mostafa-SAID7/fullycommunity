using CommunityCar.Application.Features.Identity.Commands.Login;
using MediatR;

namespace CommunityCar.Application.Features.Identity.Commands.Register;

public record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? PhoneNumber = null,
    string? UserType = null
) : IRequest<LoginResponse>;
