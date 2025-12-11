using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.Common.Interfaces.Security;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Application.Common.Behaviors;

/// <summary>
/// MediatR pipeline behavior for audit logging
/// </summary>
public class AuditBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<AuditBehavior<TRequest, TResponse>> _logger;
    private readonly ICurrentUserService _currentUserService;
    private readonly IAuditService _auditService;

    public AuditBehavior(
        ILogger<AuditBehavior<TRequest, TResponse>> logger,
        ICurrentUserService currentUserService,
        IAuditService auditService)
    {
        _logger = logger;
        _currentUserService = currentUserService;
        _auditService = auditService;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var userId = _currentUserService.UserId;
        var userEmail = _currentUserService.Email;

        // Only audit commands (not queries)
        if (requestName.EndsWith("Command"))
        {
            await _auditService.LogAsync(
                action: requestName,
                entityType: requestName.Replace("Command", ""),
                userId: userId,
                userEmail: userEmail,
                isSuccess: true
            );
        }

        return await next();
    }
}
