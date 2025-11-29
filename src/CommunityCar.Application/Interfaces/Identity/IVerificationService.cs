using CommunityCar.Application.DTOs.Identity;

namespace CommunityCar.Application.Interfaces.Identity;

public interface IVerificationService
{
    // OTP
    Task SendOtpAsync(Guid userId, SendOtpRequest request);
    Task<bool> VerifyOtpAsync(Guid userId, VerifyOtpRequest request);
    
    // Email Verification
    Task SendEmailVerificationAsync(Guid userId);
    Task<bool> VerifyEmailAsync(Guid userId, string token);
    
    // Phone Verification
    Task SendPhoneVerificationAsync(Guid userId);
    Task<bool> VerifyPhoneAsync(Guid userId, string code);
    
    // Two-Factor Authentication
    Task<Enable2FaResponse> Enable2FaAsync(Guid userId);
    Task<bool> Verify2FaAsync(Guid userId, Verify2FaRequest request);
    Task Disable2FaAsync(Guid userId);
    Task<IEnumerable<string>> GenerateRecoveryCodesAsync(Guid userId);
}
