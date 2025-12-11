namespace CommunityCar.Application.DTOs.Response.Admin;

public record UserListResponseDto
{
    public List<object> Users { get; init; } = new();
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages { get; init; }
}

public record AdminUserDto
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; }
    public bool IsActive { get; init; }
    public bool IsVerified { get; init; }
    public List<string> Roles { get; init; } = new();
    public DateTime CreatedAt { get; init; }
    public DateTime? LastLoginAt { get; init; }
}

