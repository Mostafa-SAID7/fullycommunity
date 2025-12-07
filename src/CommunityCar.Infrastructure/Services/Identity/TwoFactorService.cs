using System.Security.Cryptography;
using System.Text;
using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Identity;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using OtpNet;
using QRCoder;

namespace CommunityCar.Infrastructure.Services.Identity;

public class TwoFactorService(AppDbContext context, INotificationService notificationService) : ITwoFactorService
{
    private const string Issuer = "CommunityCar";
    private const int OtpExpirationMinutes = 5;

    public async Task<TwoFactorSetupResult> SetupAuthenticatorAsync(Guid userId)
    {
        var user = await context.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");

        var key = KeyGeneration.GenerateRandomKey(20);
        var base32Secret = Base32Encoding.ToString(key);
        user.TwoFactorSecret = base32Secret;
        await context.SaveChangesAsync();

        var otpUri = $"otpauth://totp/{Issuer}:{user.Email}?secret={base32Secret}&issuer={Issuer}&algorithm=SHA1&digits=6&period=30";

        using var qrGenerator = new QRCodeGenerator();
        var qrCodeData = qrGenerator.CreateQrCode(otpUri, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        var qrCodeBytes = qrCode.GetGraphic(20);
        var qrCodeBase64 = Convert.ToBase64String(qrCodeBytes);

        return new TwoFactorSetupResult(base32Secret, otpUri, qrCodeBase64, FormatManualEntryKey(base32Secret));
    }

    public async Task<bool> VerifyAuthenticatorSetupAsync(Guid userId, string code)
    {
        var user = await context.Users.FindAsync(userId);
        if (user?.TwoFactorSecret == null) return false;
        return ValidateTotp(user.TwoFactorSecret, code);
    }

    public async Task EnableTwoFactorAsync(Guid userId, TwoFactorType type)
    {
        var user = await context.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");
        user.TwoFactorType = type;
        user.TwoFactorEnabled = true;
        await context.SaveChangesAsync();
    }

    public async Task DisableTwoFactorAsync(Guid userId)
    {
        var user = await context.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");
        user.TwoFactorType = TwoFactorType.None;
        user.TwoFactorEnabled = false;
        user.TwoFactorSecret = null;
        user.RecoveryCodes = null;
        await context.SaveChangesAsync();
    }

    public async Task<bool> ValidateCodeAsync(Guid userId, string code, TwoFactorType type)
    {
        return type switch
        {
            TwoFactorType.Authenticator => await ValidateAuthenticatorCodeAsync(userId, code),
            TwoFactorType.Email => await ValidateEmailCodeAsync(userId, code),
            TwoFactorType.SMS => await ValidateSmsCodeAsync(userId, code),
            _ => false
        };
    }

    public async Task<bool> ValidateAuthenticatorCodeAsync(Guid userId, string code)
    {
        var user = await context.Users.FindAsync(userId);
        if (user?.TwoFactorSecret == null) return false;
        return ValidateTotp(user.TwoFactorSecret, code);
    }

    public async Task<bool> ValidateEmailCodeAsync(Guid userId, string code)
        => await ValidateOtpAsync(userId, code, OtpDeliveryMethod.Email);

    public async Task<bool> ValidateSmsCodeAsync(Guid userId, string code)
        => await ValidateOtpAsync(userId, code, OtpDeliveryMethod.SMS);


    public async Task SendEmailOtpAsync(Guid userId)
    {
        var user = await context.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");

        var otp = GenerateOtp();
        await SaveOtpAsync(userId, otp, OtpDeliveryMethod.Email, user.Email);

        await notificationService.SendTemplatedEmailAsync(
            "otp-verification",
            user.Email!,
            new Dictionary<string, string> { ["otp"] = otp, ["name"] = user.FirstName }
        );
    }

    public async Task SendSmsOtpAsync(Guid userId)
    {
        var user = await context.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");

        if (string.IsNullOrEmpty(user.PhoneNumber))
            throw new InvalidOperationException("Phone number not set");

        var otp = GenerateOtp();
        await SaveOtpAsync(userId, otp, OtpDeliveryMethod.SMS, user.PhoneNumber);
        await notificationService.SendOtpSmsAsync(user.PhoneNumber, otp);
    }

    public async Task<IEnumerable<string>> GenerateRecoveryCodesAsync(Guid userId, int count = 10)
    {
        var existingCodes = await context.TwoFactorBackupCodes
            .Where(c => c.UserId == userId && !c.IsUsed)
            .ToListAsync();
        context.TwoFactorBackupCodes.RemoveRange(existingCodes);

        var codes = new List<string>();
        for (int i = 0; i < count; i++)
        {
            var code = GenerateRecoveryCode();
            codes.Add(code);
            await context.TwoFactorBackupCodes.AddAsync(new TwoFactorBackupCode
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Code = HashCode(code),
                CreatedAt = DateTime.UtcNow
            });
        }
        await context.SaveChangesAsync();
        return codes;
    }

    public async Task<bool> ValidateRecoveryCodeAsync(Guid userId, string code)
    {
        var hashedCode = HashCode(code);
        var backupCode = await context.TwoFactorBackupCodes
            .FirstOrDefaultAsync(c => c.UserId == userId && c.Code == hashedCode && !c.IsUsed);

        if (backupCode == null) return false;
        backupCode.IsUsed = true;
        backupCode.UsedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetRemainingRecoveryCodesCountAsync(Guid userId)
        => await context.TwoFactorBackupCodes.CountAsync(c => c.UserId == userId && !c.IsUsed);

    public async Task<TwoFactorStatus> GetTwoFactorStatusAsync(Guid userId)
    {
        var user = await context.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");

        return new TwoFactorStatus(
            user.TwoFactorEnabled,
            user.TwoFactorType,
            !string.IsNullOrEmpty(user.TwoFactorSecret),
            user.EmailConfirmed,
            user.PhoneNumberConfirmed,
            await GetRemainingRecoveryCodesCountAsync(userId)
        );
    }

    private static bool ValidateTotp(string secret, string code)
    {
        var key = Base32Encoding.ToBytes(secret);
        var totp = new Totp(key);
        return totp.VerifyTotp(code, out _, new VerificationWindow(1, 1));
    }

    private async Task<bool> ValidateOtpAsync(Guid userId, string code, OtpDeliveryMethod method)
    {
        var otp = await context.OtpCodes.FirstOrDefaultAsync(o =>
            o.UserId == userId &&
            o.Code == code &&
            o.DeliveryMethod == method &&
            !o.IsUsed &&
            o.ExpiresAt > DateTime.UtcNow
        );
        if (otp == null) return false;
        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return true;
    }

    private async Task SaveOtpAsync(Guid userId, string code, OtpDeliveryMethod method, string? target)
    {
        var existingOtps = await context.OtpCodes
            .Where(o => o.UserId == userId && o.DeliveryMethod == method && !o.IsUsed)
            .ToListAsync();
        context.OtpCodes.RemoveRange(existingOtps);

        await context.OtpCodes.AddAsync(new OtpCode
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Code = code,
            Purpose = OtpPurpose.TwoFactorAuth,
            DeliveryMethod = method,
            Target = target,
            ExpiresAt = DateTime.UtcNow.AddMinutes(OtpExpirationMinutes),
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();
    }

    private static string GenerateOtp() =>
        RandomNumberGenerator.GetInt32(100000, 999999).ToString();

    private static string GenerateRecoveryCode() =>
        Convert.ToHexString(RandomNumberGenerator.GetBytes(5)).ToLower();

    private static string HashCode(string code) =>
        Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(code)));

    private static string FormatManualEntryKey(string key) =>
        string.Join(" ", Enumerable.Range(0, key.Length / 4).Select(i => key.Substring(i * 4, 4)));
}
