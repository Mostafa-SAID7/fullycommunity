using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Common.Enums;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OtpNet;
using QRCoder;
using System.Security.Cryptography;
using System.Text;

namespace CommunityCar.Infrastructure.Services.Security;

public class TwoFactorService : ITwoFactorService
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly INotificationService _notificationService;
    private readonly ILogger<TwoFactorService> _logger;
    private const string Issuer = "CommunityCar";

    public TwoFactorService(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        INotificationService notificationService,
        ILogger<TwoFactorService> logger)
    {
        _context = context;
        _userManager = userManager;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task<TwoFactorSetupResult> SetupAuthenticatorAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        // Generate secret key
        var key = KeyGeneration.GenerateRandomKey(20);
        var base32Secret = Base32Encoding.ToString(key);

        // Store temporarily (will be confirmed on verification)
        user.TwoFactorSecret = base32Secret;
        await _userManager.UpdateAsync(user);

        // Generate QR code URI
        var qrCodeUri = $"otpauth://totp/{Issuer}:{user.Email}?secret={base32Secret}&issuer={Issuer}&digits=6";

        // Generate QR code image
        using var qrGenerator = new QRCodeGenerator();
        var qrCodeData = qrGenerator.CreateQrCode(qrCodeUri, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        var qrCodeBytes = qrCode.GetGraphic(20);
        var qrCodeBase64 = Convert.ToBase64String(qrCodeBytes);

        // Format manual entry key
        var manualEntryKey = FormatManualEntryKey(base32Secret);

        return new TwoFactorSetupResult(base32Secret, qrCodeUri, qrCodeBase64, manualEntryKey);
    }

    public async Task<bool> VerifyAuthenticatorSetupAsync(Guid userId, string code)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        if (string.IsNullOrEmpty(user.TwoFactorSecret))
            return false;

        var isValid = ValidateTotpCode(user.TwoFactorSecret, code);
        
        if (isValid)
        {
            user.TwoFactorEnabled = true;
            user.TwoFactorType = TwoFactorType.Authenticator;
            await _userManager.UpdateAsync(user);
            
            _logger.LogInformation("2FA authenticator enabled for user {UserId}", userId);
        }

        return isValid;
    }

    public async Task EnableTwoFactorAsync(Guid userId, TwoFactorType type)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        user.TwoFactorEnabled = true;
        user.TwoFactorType = type;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("2FA type {Type} enabled for user {UserId}", type, userId);
    }

    public async Task DisableTwoFactorAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        user.TwoFactorEnabled = false;
        user.TwoFactorType = TwoFactorType.None;
        user.TwoFactorSecret = null;
        await _userManager.UpdateAsync(user);

        // Remove backup codes
        var backupCodes = await _context.Set<TwoFactorBackupCode>()
            .Where(c => c.UserId == userId)
            .ToListAsync();
        _context.Set<TwoFactorBackupCode>().RemoveRange(backupCodes);
        await _context.SaveChangesAsync();

        _logger.LogInformation("2FA disabled for user {UserId}", userId);
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
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user?.TwoFactorSecret == null) return false;

        return ValidateTotpCode(user.TwoFactorSecret, code);
    }

    public async Task<bool> ValidateEmailCodeAsync(Guid userId, string code)
    {
        return await ValidateOtpAsync(userId, code, OtpPurpose.TwoFactorAuth, OtpDeliveryMethod.Email);
    }

    public async Task<bool> ValidateSmsCodeAsync(Guid userId, string code)
    {
        return await ValidateOtpAsync(userId, code, OtpPurpose.TwoFactorAuth, OtpDeliveryMethod.SMS);
    }

    public async Task SendEmailOtpAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var otp = GenerateOtp();
        await SaveOtpAsync(userId, otp, OtpPurpose.TwoFactorAuth, OtpDeliveryMethod.Email, user.Email!);

        await _notificationService.SendTemplatedEmailAsync(
            "2fa-code",
            user.Email!,
            new Dictionary<string, string>
            {
                { "code", otp },
                { "name", user.FirstName },
                { "expiry", "10 minutes" }
            });
    }

    public async Task SendSmsOtpAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        if (string.IsNullOrEmpty(user.PhoneNumber))
            throw new InvalidOperationException("Phone number not set");

        var otp = GenerateOtp();
        await SaveOtpAsync(userId, otp, OtpPurpose.TwoFactorAuth, OtpDeliveryMethod.SMS, user.PhoneNumber);

        await _notificationService.SendOtpSmsAsync(user.PhoneNumber, otp);
    }

    public async Task<IEnumerable<string>> GenerateRecoveryCodesAsync(Guid userId, int count = 10)
    {
        // Remove existing codes
        var existingCodes = await _context.Set<TwoFactorBackupCode>()
            .Where(c => c.UserId == userId)
            .ToListAsync();
        _context.Set<TwoFactorBackupCode>().RemoveRange(existingCodes);

        var codes = new List<string>();
        for (int i = 0; i < count; i++)
        {
            var code = GenerateRecoveryCode();
            codes.Add(code);

            _context.Set<TwoFactorBackupCode>().Add(new TwoFactorBackupCode
            {
                UserId = userId,
                CodeHash = HashCode(code)
            });
        }

        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Generated {Count} recovery codes for user {UserId}", count, userId);
        
        return codes;
    }

    public async Task<bool> ValidateRecoveryCodeAsync(Guid userId, string code)
    {
        var codeHash = HashCode(code);
        var backupCode = await _context.Set<TwoFactorBackupCode>()
            .FirstOrDefaultAsync(c => c.UserId == userId && c.CodeHash == codeHash && !c.IsUsed);

        if (backupCode == null) return false;

        backupCode.IsUsed = true;
        backupCode.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        _logger.LogWarning("Recovery code used for user {UserId}", userId);
        
        return true;
    }

    public async Task<int> GetRemainingRecoveryCodesCountAsync(Guid userId)
    {
        return await _context.Set<TwoFactorBackupCode>()
            .CountAsync(c => c.UserId == userId && !c.IsUsed);
    }

    public async Task<TwoFactorStatus> GetTwoFactorStatusAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var remainingCodes = await GetRemainingRecoveryCodesCountAsync(userId);

        return new TwoFactorStatus(
            user.TwoFactorEnabled,
            user.TwoFactorType,
            !string.IsNullOrEmpty(user.TwoFactorSecret),
            user.EmailConfirmed,
            user.PhoneNumberConfirmed,
            remainingCodes);
    }

    private bool ValidateTotpCode(string secret, string code)
    {
        var key = Base32Encoding.ToBytes(secret);
        var totp = new Totp(key);
        return totp.VerifyTotp(code, out _, new VerificationWindow(1, 1));
    }

    private string GenerateOtp() => RandomNumberGenerator.GetInt32(100000, 999999).ToString();

    private string GenerateRecoveryCode()
    {
        var bytes = RandomNumberGenerator.GetBytes(5);
        return Convert.ToHexString(bytes).ToLower();
    }

    private string HashCode(string code)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(code));
        return Convert.ToBase64String(bytes);
    }

    private string FormatManualEntryKey(string key)
    {
        var sb = new StringBuilder();
        for (int i = 0; i < key.Length; i += 4)
        {
            if (i > 0) sb.Append(' ');
            sb.Append(key.AsSpan(i, Math.Min(4, key.Length - i)));
        }
        return sb.ToString();
    }

    private async Task SaveOtpAsync(Guid userId, string code, OtpPurpose purpose, OtpDeliveryMethod method, string target)
    {
        // Invalidate existing OTPs
        var existingOtps = await _context.OtpCodes
            .Where(o => o.UserId == userId && o.Purpose == purpose && !o.IsUsed)
            .ToListAsync();
        
        foreach (var otp in existingOtps)
            otp.IsUsed = true;

        _context.OtpCodes.Add(new OtpCode
        {
            UserId = userId,
            Code = HashCode(code),
            Purpose = purpose,
            DeliveryMethod = method,
            Target = target,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10)
        });

        await _context.SaveChangesAsync();
    }

    private async Task<bool> ValidateOtpAsync(Guid userId, string code, OtpPurpose purpose, OtpDeliveryMethod method)
    {
        var codeHash = HashCode(code);
        var otp = await _context.OtpCodes
            .FirstOrDefaultAsync(o => 
                o.UserId == userId && 
                o.Code == codeHash && 
                o.Purpose == purpose &&
                o.DeliveryMethod == method &&
                !o.IsUsed && 
                o.ExpiresAt > DateTime.UtcNow);

        if (otp == null) return false;

        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}
