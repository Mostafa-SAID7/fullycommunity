using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Zxcvbn;

namespace CommunityCar.Infrastructure.Services.Security;

public class BreachDetectionService : IBreachDetectionService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IDistributedCache _cache;
    private readonly ILogger<BreachDetectionService> _logger;
    private readonly string? _hibpApiKey;

    public BreachDetectionService(
        IHttpClientFactory httpClientFactory,
        IDistributedCache cache,
        IConfiguration configuration,
        ILogger<BreachDetectionService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _cache = cache;
        _logger = logger;
        _hibpApiKey = configuration["Security:HaveIBeenPwned:ApiKey"];
    }

    public async Task<BreachCheckResult> CheckEmailBreachAsync(string email)
    {
        var cacheKey = $"breach:email:{email.ToLowerInvariant()}";
        var cached = await _cache.GetStringAsync(cacheKey);
        if (!string.IsNullOrEmpty(cached))
        {
            return JsonSerializer.Deserialize<BreachCheckResult>(cached)!;
        }

        try
        {
            if (string.IsNullOrEmpty(_hibpApiKey))
            {
                _logger.LogWarning("HaveIBeenPwned API key not configured");
                return new BreachCheckResult(false, 0, []);
            }

            var client = _httpClientFactory.CreateClient("HaveIBeenPwned");
            client.DefaultRequestHeaders.Add("hibp-api-key", _hibpApiKey);
            client.DefaultRequestHeaders.Add("user-agent", "CommunityCar-Security-Check");

            var response = await client.GetAsync($"https://haveibeenpwned.com/api/v3/breachedaccount/{Uri.EscapeDataString(email)}");

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                var result = new BreachCheckResult(false, 0, []);
                await CacheResult(cacheKey, result);
                return result;
            }

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var breaches = JsonSerializer.Deserialize<List<HibpBreach>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? [];

                var breachInfos = breaches.Select(b => new BreachInfo(
                    b.Name,
                    b.Title,
                    b.Domain,
                    b.BreachDate,
                    b.AddedDate,
                    b.PwnCount,
                    b.Description,
                    b.DataClasses,
                    b.IsVerified,
                    b.IsSensitive
                )).ToList();

                var result = new BreachCheckResult(true, breachInfos.Count, breachInfos);
                await CacheResult(cacheKey, result);
                return result;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check email breach for {Email}", email);
        }

        return new BreachCheckResult(false, 0, []);
    }

    public async Task<bool> IsPasswordCompromisedAsync(string password)
    {
        var count = await GetPasswordBreachCountAsync(password);
        return count > 0;
    }

    public async Task<int> GetPasswordBreachCountAsync(string password)
    {
        try
        {
            // Use k-anonymity model - only send first 5 chars of SHA-1 hash
            var sha1Hash = GetSha1Hash(password).ToUpperInvariant();
            var prefix = sha1Hash[..5];
            var suffix = sha1Hash[5..];

            var cacheKey = $"breach:pwd:{prefix}";
            var cached = await _cache.GetStringAsync(cacheKey);
            
            string responseText;
            if (!string.IsNullOrEmpty(cached))
            {
                responseText = cached;
            }
            else
            {
                var client = _httpClientFactory.CreateClient("HaveIBeenPwned");
                var response = await client.GetAsync($"https://api.pwnedpasswords.com/range/{prefix}");
                
                if (!response.IsSuccessStatusCode)
                    return 0;

                responseText = await response.Content.ReadAsStringAsync();
                
                // Cache for 1 hour
                await _cache.SetStringAsync(cacheKey, responseText, new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                });
            }

            // Parse response to find matching suffix
            foreach (var line in responseText.Split('\n'))
            {
                var parts = line.Trim().Split(':');
                if (parts.Length == 2 && parts[0] == suffix)
                {
                    return int.Parse(parts[1]);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check password breach");
        }

        return 0;
    }

    public Task<PasswordStrengthResult> CheckPasswordStrengthAsync(string password)
    {
        var result = Core.EvaluatePassword(password);
        
        var strength = result.Score switch
        {
            0 => "Weak",
            1 => "Fair",
            2 => "Good",
            3 => "Strong",
            4 => "Very Strong",
            _ => "Unknown"
        };

        var crackTime = result.CrackTimeDisplay.OfflineSlowHashing1e4PerSecond;
        var estimatedTime = ParseCrackTime(crackTime);

        return Task.FromResult(new PasswordStrengthResult(
            result.Score,
            strength,
            result.Guesses,
            result.Feedback.Warning,
            result.Feedback.Suggestions,
            estimatedTime
        ));
    }

    public async Task<IEnumerable<BreachInfo>> GetDomainBreachesAsync(string domain)
    {
        try
        {
            if (string.IsNullOrEmpty(_hibpApiKey))
            {
                _logger.LogWarning("HaveIBeenPwned API key not configured");
                return [];
            }

            var client = _httpClientFactory.CreateClient("HaveIBeenPwned");
            client.DefaultRequestHeaders.Add("hibp-api-key", _hibpApiKey);
            client.DefaultRequestHeaders.Add("user-agent", "CommunityCar-Security-Check");

            var response = await client.GetAsync($"https://haveibeenpwned.com/api/v3/breaches?domain={Uri.EscapeDataString(domain)}");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var breaches = JsonSerializer.Deserialize<List<HibpBreach>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }) ?? [];

                return breaches.Select(b => new BreachInfo(
                    b.Name,
                    b.Title,
                    b.Domain,
                    b.BreachDate,
                    b.AddedDate,
                    b.PwnCount,
                    b.Description,
                    b.DataClasses,
                    b.IsVerified,
                    b.IsSensitive
                ));
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get domain breaches for {Domain}", domain);
        }

        return [];
    }

    private string GetSha1Hash(string input)
    {
        var bytes = SHA1.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }

    private async Task CacheResult(string key, BreachCheckResult result)
    {
        await _cache.SetStringAsync(key, JsonSerializer.Serialize(result), new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
        });
    }

    private TimeSpan ParseCrackTime(string crackTime)
    {
        // Simple parsing - in production, use more sophisticated parsing
        if (crackTime.Contains("centuries")) return TimeSpan.FromDays(36500);
        if (crackTime.Contains("years")) return TimeSpan.FromDays(365);
        if (crackTime.Contains("months")) return TimeSpan.FromDays(30);
        if (crackTime.Contains("days")) return TimeSpan.FromDays(1);
        if (crackTime.Contains("hours")) return TimeSpan.FromHours(1);
        if (crackTime.Contains("minutes")) return TimeSpan.FromMinutes(1);
        return TimeSpan.FromSeconds(1);
    }

    private class HibpBreach
    {
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public DateTime BreachDate { get; set; }
        public DateTime AddedDate { get; set; }
        public int PwnCount { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<string> DataClasses { get; set; } = [];
        public bool IsVerified { get; set; }
        public bool IsSensitive { get; set; }
    }
}
