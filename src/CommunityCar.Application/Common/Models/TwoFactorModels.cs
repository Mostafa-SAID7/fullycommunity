using CommunityCar.Domain.Enums;

namespace CommunityCar.Application.Common.Models;

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
