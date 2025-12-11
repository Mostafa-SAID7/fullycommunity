namespace CommunityCar.Application.DTOs.Requests.Admin;

public record BanUserRequest
{
    public string Reason { get; init; } = string.Empty;
    public DateTime? BanUntil { get; init; }
}

public record AssignRoleRequest
{
    public List<string> Roles { get; init; } = new();
}

