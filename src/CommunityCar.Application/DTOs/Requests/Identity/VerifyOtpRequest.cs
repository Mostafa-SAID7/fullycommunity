namespace CommunityCar.Application.DTOs.Requests.Identity;

public record VerifyOtpRequest(string Code, string Type);
