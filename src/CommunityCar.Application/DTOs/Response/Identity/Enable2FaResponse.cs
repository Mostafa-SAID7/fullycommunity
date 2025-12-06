namespace CommunityCar.Application.DTOs.Response.Identity;

public record Enable2FaResponse(
    string SharedKey,
    string QrCodeBase64,
    string ManualEntryKey
);
