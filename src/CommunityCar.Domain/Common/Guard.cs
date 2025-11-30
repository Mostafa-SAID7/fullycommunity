using CommunityCar.Domain.Exceptions;

namespace CommunityCar.Domain.Common;

public static class Guard
{
    public static void AgainstNull<T>(T? value, string parameterName) where T : class
    {
        if (value is null)
            throw new ArgumentNullException(parameterName);
    }

    public static void AgainstNullOrEmpty(string? value, string parameterName)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException($"{parameterName} cannot be null or empty", parameterName);
    }

    public static void AgainstNullOrEmpty<T>(IEnumerable<T>? value, string parameterName)
    {
        if (value is null || !value.Any())
            throw new ArgumentException($"{parameterName} cannot be null or empty", parameterName);
    }

    public static void AgainstNegative(decimal value, string parameterName)
    {
        if (value < 0)
            throw new ArgumentException($"{parameterName} cannot be negative", parameterName);
    }

    public static void AgainstNegativeOrZero(decimal value, string parameterName)
    {
        if (value <= 0)
            throw new ArgumentException($"{parameterName} must be greater than zero", parameterName);
    }

    public static void AgainstOutOfRange(int value, int min, int max, string parameterName)
    {
        if (value < min || value > max)
            throw new ArgumentOutOfRangeException(parameterName, $"{parameterName} must be between {min} and {max}");
    }

    public static void AgainstInvalidGuid(Guid value, string parameterName)
    {
        if (value == Guid.Empty)
            throw new ArgumentException($"{parameterName} cannot be empty", parameterName);
    }

    public static void AgainstFutureDate(DateTime value, string parameterName)
    {
        if (value > DateTime.UtcNow)
            throw new ArgumentException($"{parameterName} cannot be in the future", parameterName);
    }

    public static void AgainstPastDate(DateTime value, string parameterName)
    {
        if (value < DateTime.UtcNow)
            throw new ArgumentException($"{parameterName} cannot be in the past", parameterName);
    }

    public static void AgainstBrokenRule(IBusinessRule rule)
    {
        if (rule.IsBroken())
            throw new BusinessRuleValidationException(rule);
    }
}
