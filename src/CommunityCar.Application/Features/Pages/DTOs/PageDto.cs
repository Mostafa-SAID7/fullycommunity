using CommunityCar.Domain.Entities.Community.Pages;

namespace CommunityCar.Application.Features.Pages.DTOs;

public class PageDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Bio { get; set; }
    
    public string? ProfileImageUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    
    public PageCategory Category { get; set; }
    public PageType Type { get; set; }
    public bool IsVerified { get; set; }
    public bool IsPublic { get; set; }
    
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
    
    public PageOwnerDto Owner { get; set; } = null!;
    
    public int FollowerCount { get; set; }
    public int PostCount { get; set; }
    public int StoryCount { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    
    public bool IsFollowing { get; set; }
    public bool IsOwner { get; set; }
    public bool IsAdmin { get; set; }
    
    public DateTime CreatedAt { get; set; }
}

public class PageOwnerDto
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsVerified { get; set; }
}

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