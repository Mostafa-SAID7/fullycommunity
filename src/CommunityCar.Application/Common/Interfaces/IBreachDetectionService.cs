using CommunityCar.Application.Common.Models;

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
