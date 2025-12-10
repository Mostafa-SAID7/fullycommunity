namespace CommunityCar.Application.DTOs.Response.Auth.Common;

public record Enable2FaResponse(
    string SharedKey,
    string QrCodeBase64,
    string ManualEntryKey
);
