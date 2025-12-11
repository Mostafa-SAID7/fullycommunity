namespace CommunityCar.Application.DTOs.Requests.Auth.User;

public record ExternalLoginRequest(
    string Provider,
    string ProviderKey,
    string? Email = null,
    string? FirstName = null,
    string? LastName = null,
    string? DeviceId = null
);

public record LinkExternalLoginRequest(
    string Provider,
    string ProviderKey
);
