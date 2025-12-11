namespace CommunityCar.Application.DTOs.Requests.Home;

public record CreateStoryRequest
{
    public string? PageId { get; init; }
    public string MediaUrl { get; init; } = string.Empty;
    public string MediaType { get; init; } = string.Empty;
    public string? Caption { get; init; }
    public DateTime? ExpiresAt { get; init; }
}

