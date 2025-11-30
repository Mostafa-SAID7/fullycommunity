using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CommunityCar.Infrastructure.External.Sms;

public class TwilioSmsService : ISmsService
{
    private readonly SmsSettings _settings;
    private readonly ILogger<TwilioSmsService> _logger;

    public TwilioSmsService(IOptions<SmsSettings> settings, ILogger<TwilioSmsService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<bool> SendAsync(string phoneNumber, string message)
    {
        try
        {
            // Implement Twilio SDK integration
            _logger.LogInformation("Sending SMS to {PhoneNumber}", phoneNumber);

            // Placeholder - implement actual Twilio integration
            await Task.Delay(100);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SMS to {PhoneNumber}", phoneNumber);
            return false;
        }
    }

    public async Task<bool> SendOtpAsync(string phoneNumber, string otp)
    {
        var message = $"Your CommunityCar verification code is: {otp}. Valid for 10 minutes.";
        return await SendAsync(phoneNumber, message);
    }
}
