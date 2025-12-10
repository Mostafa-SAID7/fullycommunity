namespace CommunityCar.Application.DTOs.Requests.Auth.User;

public record ConfirmEmailRequest(string UserId, string Token);
