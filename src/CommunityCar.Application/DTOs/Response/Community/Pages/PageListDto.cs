using CommunityCar.Domain.Entities.Community.Pages;

namespace CommunityCar.Application.DTOs.Response.Community.Pages;

public class PageListDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ProfileImageUrl { get; set; }
    public PageCategory Category { get; set; }
    public bool IsVerified { get; set; }
    public int FollowerCount { get; set; }
    public double AverageRating { get; set; }
    public bool IsFollowing { get; set; }
}
