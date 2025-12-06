namespace CommunityCar.Application.DTOs.Requests.Identity;

public record ExternalLoginRequest(
    string Provider,
    string ProviderKey,
    string? Email = null,
    string? FirstName = null,
    string? LastName = null,
    string? DeviceId = null
);
