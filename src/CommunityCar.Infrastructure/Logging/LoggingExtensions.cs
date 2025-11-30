using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Logging;

public static class LoggingExtensions
{
    private static readonly Action<ILogger, string, Guid, Exception?> _userLoggedIn =
        LoggerMessage.Define<string, Guid>(
            LogLevel.Information,
            new EventId(1001, "UserLoggedIn"),
            "User {Email} ({UserId}) logged in");

    private static readonly Action<ILogger, string, Exception?> _loginFailed =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            new EventId(1002, "LoginFailed"),
            "Login failed for {Email}");

    private static readonly Action<ILogger, Guid, Exception?> _userCreated =
        LoggerMessage.Define<Guid>(
            LogLevel.Information,
            new EventId(1003, "UserCreated"),
            "User created: {UserId}");

    private static readonly Action<ILogger, string, string, Exception?> _securityAlert =
        LoggerMessage.Define<string, string>(
            LogLevel.Warning,
            new EventId(2001, "SecurityAlert"),
            "Security alert: {AlertType} - {Details}");

    public static void UserLoggedIn(this ILogger logger, string email, Guid userId)
        => _userLoggedIn(logger, email, userId, null);

    public static void LoginFailed(this ILogger logger, string email)
        => _loginFailed(logger, email, null);

    public static void UserCreated(this ILogger logger, Guid userId)
        => _userCreated(logger, userId, null);

    public static void SecurityAlert(this ILogger logger, string alertType, string details)
        => _securityAlert(logger, alertType, details, null);
}
