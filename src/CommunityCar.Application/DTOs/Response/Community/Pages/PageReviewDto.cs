namespace CommunityCar.Application.DTOs.Response.Community.Pages;

public class PageReviewDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public PageOwnerDto User { get; set; } = null!;
    
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = new();
    
    public int HelpfulCount { get; set; }
    public string? OwnerResponse { get; set; }
    public DateTime? OwnerResponseAt { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
