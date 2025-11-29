using CommunityCar.Application.Features.Identity.Commands.Login;
using MediatR;

namespace CommunityCar.Application.Features.Identity.Queries.GetCurrentUser;

public record GetCurrentUserQuery(Guid UserId) : IRequest<UserDto?>;
