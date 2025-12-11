using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Application.DTOs.Requests.Security;
using CommunityCar.Application.DTOs.Response.Security;
using CommunityCar.Domain.Enums;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using OtpNet;

namespace CommunityCar.Infrastructure.Services.Security;

public class VerificationService : IVerificationService
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly INotificationService _notificationService;
    private const int OtpExpirationMinutes = 10;
    private const int OtpLength = 6;

    public VerificationService(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        INotificationService notificationService)
    {
        _context = context;
        _userManager = userManager;
        _notificationService = notificationService;
    }

    public async Task SendOtpAsync(Guid userId, SendOtpRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var code = GenerateOtpCode();
        var otp = new OtpCode
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Code = code,
            Purpose = OtpPurpose.PhoneVerification,
            DeliveryMethod = OtpDeliveryMethod.SMS,
            Target = request.PhoneNumber,
            ExpiresAt = DateTime.UtcNow.AddMinutes(OtpExpirationMinutes),
            CreatedAt = DateTime.UtcNow
        };

        await _context.OtpCodes.AddAsync(otp);
        await _context.SaveChangesAsync();

        await _notificationService.SendOtpSmsAsync(request.PhoneNumber, code);
    }

    public async Task<bool> VerifyOtpAsync(Guid userId, VerifyOtpRequest request)
    {
        var otp = await _context.OtpCodes
            .FirstOrDefaultAsync(o => o.UserId == userId 
                && o.Target == request.PhoneNumber
                && o.Code == request.Code
                && o.Purpose == OtpPurpose.PhoneVerification
                && !o.IsUsed
                && o.ExpiresAt > DateTime.UtcNow);

        if (otp == null) return false;

        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user != null && user.PhoneNumber == request.PhoneNumber)
        {
            user.PhoneNumberConfirmed = true;
            await _userManager.UpdateAsync(user);
        }

        return true;
    }

    public async Task SendEmailVerificationAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));

        var verificationUrl = $"https://communitycar.com/verify-email?userId={userId}&token={encodedToken}";
        var emailBody = $"Please verify your email by clicking this link: {verificationUrl}";

        await _notificationService.SendEmailAsync(new Application.Common.Models.EmailMessage(
            user.Email!,
            "Verify your email",
            emailBody,
            true
        ));
    }

    public async Task<bool> VerifyEmailAsync(Guid userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var decodedToken = Encoding.UTF8.GetString(Convert.FromBase64String(token));
        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
        return result.Succeeded;
    }

    public async Task SendPhoneVerificationAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        if (string.IsNullOrEmpty(user.PhoneNumber))
            throw new InvalidOperationException("User has no phone number");

        var code = GenerateOtpCode();
        var otp = new OtpCode
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Code = code,
            Purpose = OtpPurpose.PhoneVerification,
            DeliveryMethod = OtpDeliveryMethod.SMS,
            Target = user.PhoneNumber,
            ExpiresAt = DateTime.UtcNow.AddMinutes(OtpExpirationMinutes),
            CreatedAt = DateTime.UtcNow
        };

        await _context.OtpCodes.AddAsync(otp);
        await _context.SaveChangesAsync();

        await _notificationService.SendOtpSmsAsync(user.PhoneNumber, code);
    }

    public async Task<bool> VerifyPhoneAsync(Guid userId, string code)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        if (string.IsNullOrEmpty(user.PhoneNumber))
            return false;

        var otp = await _context.OtpCodes
            .FirstOrDefaultAsync(o => o.UserId == userId 
                && o.Target == user.PhoneNumber
                && o.Code == code
                && o.Purpose == OtpPurpose.PhoneVerification
                && !o.IsUsed
                && o.ExpiresAt > DateTime.UtcNow);

        if (otp == null) return false;

        otp.IsUsed = true;
        otp.UsedAt = DateTime.UtcNow;
        user.PhoneNumberConfirmed = true;
        await _context.SaveChangesAsync();
        await _userManager.UpdateAsync(user);

        return true;
    }

    public async Task<Enable2FaResponse> Enable2FaAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var secretKey = KeyGeneration.GenerateRandomKey(20);
        var base32Secret = Base32Encoding.ToString(secretKey);
        user.TwoFactorSecret = base32Secret;

        var issuer = "CommunityCar";
        var accountName = user.Email ?? user.UserName ?? "User";
        var qrCodeUri = $"otpauth://totp/{Uri.EscapeDataString(issuer)}:{Uri.EscapeDataString(accountName)}?secret={base32Secret}&issuer={Uri.EscapeDataString(issuer)}";

        await _userManager.UpdateAsync(user);

        return new Enable2FaResponse(qrCodeUri, base32Secret);
    }

    public async Task<bool> Verify2FaAsync(Guid userId, Verify2FaRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        if (string.IsNullOrEmpty(user.TwoFactorSecret))
            return false;

        var totp = new Totp(Base32Encoding.ToBytes(user.TwoFactorSecret));
        return totp.VerifyTotp(request.Code, out _, new VerificationWindow(2, 2));
    }

    public async Task Disable2FaAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        user.TwoFactorType = TwoFactorType.None;
        user.TwoFactorSecret = null;
        await _userManager.UpdateAsync(user);
    }

    public async Task<IEnumerable<string>> GenerateRecoveryCodesAsync(Guid userId)
    {
        var codes = new List<string>();
        for (int i = 0; i < 10; i++)
        {
            codes.Add(GenerateRecoveryCode());
        }
        return codes;
    }

    private string GenerateOtpCode()
    {
        var random = new Random();
        var code = new StringBuilder();
        for (int i = 0; i < OtpLength; i++)
        {
            code.Append(random.Next(0, 10));
        }
        return code.ToString();
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

