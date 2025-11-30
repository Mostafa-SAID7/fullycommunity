namespace CommunityCar.Application.Common.Models;

public record BreachCheckResult(
    bool IsBreached,
    int BreachCount,
    IEnumerable<BreachInfo> Breaches
);

public record BreachInfo(
    string Name,
    string Title,
    string Domain,
    DateTime BreachDate,
    DateTime AddedDate,
    int PwnCount,
    string Description,
    IEnumerable<string> DataClasses,
    bool IsVerified,
    bool IsSensitive
);

public record PasswordStrengthResult(
    int Score,
    string Strength,
    double Entropy,
    string? Warning,
    IEnumerable<string> Suggestions,
    TimeSpan EstimatedCrackTime
);
