using CommunityCar.Domain.Entities.Community.Pages;

namespace CommunityCar.Application.DTOs.Requests.Community.Pages;

public class CreatePageRequest
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Bio { get; set; }
    public PageCategory Category { get; set; } = PageCategory.Automotive;
    public PageType Type { get; set; } = PageType.Business;
    public bool IsPublic { get; set; } = true;
    
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
}
