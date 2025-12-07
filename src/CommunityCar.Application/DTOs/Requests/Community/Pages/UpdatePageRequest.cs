using CommunityCar.Domain.Entities.Community.Pages;
using CommunityCar.Domain.Enums.Community.Pages;

namespace CommunityCar.Application.DTOs.Requests.Community.Pages;

public class UpdatePageRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Bio { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public PageCategory? Category { get; set; }
    public bool? IsPublic { get; set; }
    
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    
    public string? BusinessHours { get; set; }
    public string? FacebookUrl { get; set; }
    public string? InstagramUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? YouTubeUrl { get; set; }
    public string? LinkedInUrl { get; set; }
}
