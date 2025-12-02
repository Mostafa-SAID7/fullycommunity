namespace CommunityCar.Application.Features.Admin.Dashboard.Users;

public record AdminUserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string AccountStatus { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public string CreatedAt { get; set; } = string.Empty;
    public string? LastLoginAt { get; set; }
    public bool IsEmailVerified { get; set; }
    public bool IsPhoneVerified { get; set; }
}

public record UserListResponseDto
{
    public List<AdminUserDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public record BanUserRequest
{
    public string Reason { get; set; } = string.Empty;
    public int? DurationDays { get; set; }
}

public record AssignRoleRequest
{
    public string Role { get; set; } = string.Empty;
}
