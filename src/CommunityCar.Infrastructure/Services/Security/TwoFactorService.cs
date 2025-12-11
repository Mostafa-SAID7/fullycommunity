using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OtpNet;
using QRCoder;
using System.Text;
using System.Text.Json;

namespace CommunityCar.Infrastructure.Services.Security;

public class TwoFactorService : ITwoFactorService
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private const int OtpExpirationMinutes = 5;

    public TwoFactorService(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<TwoFactorSetupResult> SetupAuthenticatorAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var secretKey = KeyGeneration.GenerateRandomKey(20);
        var base32Secret = Base32Encoding.ToString(secretKey);
        user.TwoFactorSecret = base32Secret;

        var issuer = "CommunityCar";
        var accountName = user.Email ?? user.UserName ?? "User";
        var qrCodeUri = $"otpauth://totp/{Uri.EscapeDataString(issuer)}:{Uri.EscapeDataString(accountName)}?secret={base32Secret}&issuer={Uri.EscapeDataString(issuer)}";

        var qrGenerator = new QRCodeGenerator();
        var qrCodeData = qrGenerator.CreateQrCode(qrCodeUri, QRCodeGenerator.ECCLevel.Q);
        var qrCode = new PngByteQRCode(qrCodeData);
        var qrCodeBytes = qrCode.GetGraphic(20);

        await _userManager.UpdateAsync(user);

        return new TwoFactorSetupResult(
            base32Secret,
            qrCodeUri,
            Convert.ToBase64String(qrCodeBytes),
            base32Secret
        );
    }

    public async Task<bool> VerifyAuthenticatorSetupAsync(Guid userId, string code)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        if (string.IsNullOrEmpty(user.TwoFactorSecret))
            return false;

        var totp = new Totp(Base32Encoding.ToBytes(user.TwoFactorSecret));
        return totp.VerifyTotp(code, out _, new VerificationWindow(2, 2));
    }

    public async Task EnableTwoFactorAsync(Guid userId, TwoFactorType type)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        user.TwoFactorType = type;
        await _userManager.UpdateAsync(user);
    }

    public async Task DisableTwoFactorAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        user.TwoFactorType = TwoFactorType.None;
        user.TwoFactorSecret = null;
        await _userManager.UpdateAsync(user);

        // Remove backup codes
        var codes = await _context.TwoFactorBackupCodes
            .Where(c => c.UserId == userId)
            .ToListAsync();
        _context.TwoFactorBackupCodes.RemoveRange(codes);
        await _context.SaveChangesAsync();
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
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        if (string.IsNullOrEmpty(user.TwoFactorSecret))
            return false;

        var totp = new Totp(Base32Encoding.ToBytes(user.TwoFactorSecret));
        return totp.VerifyTotp(code, out _, new VerificationWindow(2, 2));
    }

    public async Task<bool> ValidateEmailCodeAsync(Guid userId, string code)
    {
        var otp = await _context.OtpCodes
            .FirstOrDefaultAsync(o => o.UserId == userId 
                && o.Code == code 
                && o.Purpose == OtpPurpose.TwoFactorAuth
                && o.DeliveryMethod == OtpDeliveryMethod.Email
                && !o.IsUsed
                && o.ExpiresAt > DateTime.UtcNow);

        if (otp == null) return false;

        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ValidateSmsCodeAsync(Guid userId, string code)
    {
        var otp = await _context.OtpCodes
            .FirstOrDefaultAsync(o => o.UserId == userId 
                && o.Code == code 
                && o.Purpose == OtpPurpose.TwoFactorAuth
                && o.DeliveryMethod == OtpDeliveryMethod.SMS
                && !o.IsUsed
                && o.ExpiresAt > DateTime.UtcNow);

        if (otp == null) return false;

        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public Task SendEmailOtpAsync(Guid userId)
    {
        // Implementation would use INotificationService
        return Task.CompletedTask;
    }

    public Task SendSmsOtpAsync(Guid userId)
    {
        // Implementation would use INotificationService
        return Task.CompletedTask;
    }

    public async Task<IEnumerable<string>> GenerateRecoveryCodesAsync(Guid userId, int count = 10)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var codes = new List<string>();
        var backupCodes = new List<TwoFactorBackupCode>();

        for (int i = 0; i < count; i++)
        {
            var code = GenerateRecoveryCode();
            codes.Add(code);
            backupCodes.Add(new TwoFactorBackupCode
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Code = code,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.TwoFactorBackupCodes.AddRangeAsync(backupCodes);
        await _context.SaveChangesAsync();

        return codes;
    }

    public async Task<bool> ValidateRecoveryCodeAsync(Guid userId, string code)
    {
        var backupCode = await _context.TwoFactorBackupCodes
            .FirstOrDefaultAsync(c => c.UserId == userId && c.Code == code && !c.IsUsed);

        if (backupCode == null) return false;

        backupCode.IsUsed = true;
        backupCode.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetRemainingRecoveryCodesCountAsync(Guid userId)
    {
        return await _context.TwoFactorBackupCodes
            .CountAsync(c => c.UserId == userId && !c.IsUsed);
    }

    public async Task<TwoFactorStatus> GetTwoFactorStatusAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var hasAuthenticator = !string.IsNullOrEmpty(user.TwoFactorSecret);
        var hasEmailVerified = user.EmailConfirmed;
        var hasPhoneVerified = !string.IsNullOrEmpty(user.PhoneNumber) && user.PhoneNumberConfirmed;
        var recoveryCodesRemaining = await GetRemainingRecoveryCodesCountAsync(userId);

        return new TwoFactorStatus(
            user.TwoFactorType != TwoFactorType.None,
            user.TwoFactorType,
            hasAuthenticator,
            hasEmailVerified,
            hasPhoneVerified,
            recoveryCodesRemaining
        );
    }

    private string GenerateRecoveryCode()
    {
        var random = new Random();
        var code = new StringBuilder();
        for (int i = 0; i < 8; i++)
        {
            code.Append(random.Next(0, 10));
        }
        return code.ToString();
    }
}

