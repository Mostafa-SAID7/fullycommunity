using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.DTOs.Identity;
using CommunityCar.Application.Interfaces.Identity;
using CommunityCar.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace CommunityCar.Infrastructure.Services.Identity;

public class VerificationService : IVerificationService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITwoFactorService _twoFactorService;
    private readonly INotificationService _notificationService;

    public VerificationService(
        UserManager<ApplicationUser> userManager,
        ITwoFactorService twoFactorService,
        INotificationService notificationService)
    {
        _userManager = userManager;
        _twoFactorService = twoFactorService;
        _notificationService = notificationService;
    }

    public async Task SendOtpAsync(Guid userId, SendOtpRequest request)
    {
        if (request.Type == "email")
            await _twoFactorService.SendEmailOtpAsync(userId);
        else if (request.Type == "sms")
            await _twoFactorService.SendSmsOtpAsync(userId);
    }

    public async Task<bool> VerifyOtpAsync(Guid userId, VerifyOtpRequest request)
    {
        return request.Type switch
        {
            "email" => await _twoFactorService.ValidateEmailCodeAsync(userId, request.Code),
            "sms" => await _twoFactorService.ValidateSmsCodeAsync(userId, request.Code),
            _ => false
        };
    }

    public async Task SendEmailVerificationAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString())
            ?? throw new InvalidOperationException("User not found");

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        await _notificationService.SendTemplatedEmailAsync("email-verification", user.Email!,
            new Dictionary<string, string> { ["name"] = user.FirstName, ["token"] = token });
    }

    public async Task<bool> VerifyEmailAsync(Guid userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;

        var result = await _userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded;
    }

    public async Task SendPhoneVerificationAsync(Guid userId)
    {
        await _twoFactorService.SendSmsOtpAsync(userId);
    }

    public async Task<bool> VerifyPhoneAsync(Guid userId, string code)
    {
        var isValid = await _twoFactorService.ValidateSmsCodeAsync(userId, code);
        if (!isValid) return false;

        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user != null)
        {
            user.PhoneNumberConfirmed = true;
            await _userManager.UpdateAsync(user);
        }
        return true;
    }

    public async Task<Enable2FaResponse> Enable2FaAsync(Guid userId)
    {
        var result = await _twoFactorService.SetupAuthenticatorAsync(userId);
        return new Enable2FaResponse(result.SharedKey, result.QrCodeBase64, result.ManualEntryKey);
    }

    public async Task<bool> Verify2FaAsync(Guid userId, Verify2FaRequest request)
    {
        var isValid = await _twoFactorService.VerifyAuthenticatorSetupAsync(userId, request.Code);
        if (isValid)
            await _twoFactorService.EnableTwoFactorAsync(userId, Domain.Common.Enums.TwoFactorType.Authenticator);
        return isValid;
    }

    public async Task Disable2FaAsync(Guid userId)
    {
        await _twoFactorService.DisableTwoFactorAsync(userId);
    }

    public async Task<IEnumerable<string>> GenerateRecoveryCodesAsync(Guid userId)
    {
        return await _twoFactorService.GenerateRecoveryCodesAsync(userId);
    }
}
