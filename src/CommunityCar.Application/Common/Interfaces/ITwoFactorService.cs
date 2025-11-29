using CommunityCar.Domain.Common.Enums;

namespace CommunityCar.Application.Common.Interfaces;

public interface ITwoFactorService
{
    // Setup
    Task<TwoFactorSetupResult> SetupAuthenticatorAsync(Guid userId);
    Task<bool> VerifyAuthenticatorSetupAsync(Guid userId, string code);
    Task EnableTwoFactorAsync(Guid userId, TwoFactorType type);
    Task DisableTwoFactorAsync(Guid userId);
    
    // Verification
    Task<bool> ValidateCodeAsync(Guid userId, string code, TwoFactorType type);
    Task<bool> ValidateAuthenticatorCodeAsync(Guid userId, string code);
    Task<bool> ValidateEmailCodeAsync(Guid userId, string code);
    Task<bool> ValidateSmsCodeAsync(Guid userId, string code);
    
    // OTP Sending
    Task SendEmailOtpAsync(Guid userId);
    Task SendSmsOtpAsync(Guid userId);
    
    // Recovery Codes
    Task<IEnumerable<string>> GenerateRecoveryCodesAsync(Guid userId, int count = 10);
    Task<bool> ValidateRecoveryCodeAsync(Guid userId, string code);
    Task<int> GetRemainingRecoveryCodesCountAsync(Guid userId);
    
    // Status
    Task<TwoFactorStatus> GetTwoFactorStatusAsync(Guid userId);
}

public record TwoFactorSetupResult(
    string SharedKey,
    string QrCodeUri,
    string QrCodeBase64,
    string ManualEntryKey
);

public record TwoFactorStatus(
    bool IsEnabled,
    TwoFactorType Type,
    bool HasAuthenticator,
    bool HasEmailVerified,
    bool HasPhoneVerified,
    int RecoveryCodesRemaining
);
