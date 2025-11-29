namespace CommunityCar.Application.Common.Interfaces;

public interface IBreachDetectionService
{
    // Email Breach Check (HaveIBeenPwned)
    Task<BreachCheckResult> CheckEmailBreachAsync(string email);
    
    // Password Breach Check
    Task<bool> IsPasswordCompromisedAsync(string password);
    Task<int> GetPasswordBreachCountAsync(string password);
    
    // Password Strength
    Task<PasswordStrengthResult> CheckPasswordStrengthAsync(string password);
    
    // Domain Breach Check
    Task<IEnumerable<BreachInfo>> GetDomainBreachesAsync(string domain);
}

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
    int Score, // 0-4
    string Strength, // Weak, Fair, Good, Strong, Very Strong
    double Entropy,
    string? Warning,
    IEnumerable<string> Suggestions,
    TimeSpan EstimatedCrackTime
);
