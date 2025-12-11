using System.Reflection;
using CommunityCar.Application.Common.Exceptions;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.Common.Security;
using MediatR;

namespace CommunityCar.Application.Common.Behaviors;

public class AuthorizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ICurrentUserService _currentUserService;

    public AuthorizationBehavior(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();

        if (!authorizeAttributes.Any())
        {
            return await next();
        }

        if (!_currentUserService.IsAuthenticated)
        {
            throw new UnauthorizedAccessException();
        }

        var authorizeAttributesWithRoles = authorizeAttributes
            .Where(a => !string.IsNullOrWhiteSpace(a.Roles));

        foreach (var attribute in authorizeAttributesWithRoles)
        {
            var roles = attribute.Roles.Split(',').Select(r => r.Trim());
            var hasRole = roles.Any(role => _currentUserService.Roles.Contains(role));

            if (!hasRole)
            {
                throw new ForbiddenAccessException();
            }
        }

        return await next();
    }
}
