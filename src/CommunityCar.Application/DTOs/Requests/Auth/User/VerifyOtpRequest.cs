namespace CommunityCar.Application.DTOs.Requests.Auth.User;

public record VerifyOtpRequest(string Code, string Type);
