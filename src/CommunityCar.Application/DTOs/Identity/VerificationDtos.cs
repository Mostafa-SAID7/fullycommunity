namespace CommunityCar.Application.DTOs.Identity;

public record SendOtpRequest(string Type);

public record VerifyOtpRequest(string Code, string Type);

public record Enable2FaResponse(
    string SharedKey,
    string QrCodeBase64,
    string ManualEntryKey
);

public record Verify2FaRequest(string Code);
