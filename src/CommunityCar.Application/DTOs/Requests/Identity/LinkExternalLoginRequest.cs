namespace CommunityCar.Application.DTOs.Requests.Identity;

public record LinkExternalLoginRequest(
    string Provider,
    string IdToken
);
