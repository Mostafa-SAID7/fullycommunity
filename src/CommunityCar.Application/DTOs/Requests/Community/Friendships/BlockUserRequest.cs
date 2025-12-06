namespace CommunityCar.Application.DTOs.Requests.Community.Friendships;

public record BlockUserRequest(Guid UserId, string? Reason);
