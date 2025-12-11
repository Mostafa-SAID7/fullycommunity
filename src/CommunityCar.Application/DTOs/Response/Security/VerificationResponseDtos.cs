namespace CommunityCar.Application.DTOs.Response.Security;

public record Enable2FaResponse(
    string QrCodeUrl,
    string SecretKey
);
