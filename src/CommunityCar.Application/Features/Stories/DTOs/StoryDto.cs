using CommunityCar.Domain.Entities.Home;
using CommunityCar.Domain.Entities.Community.Pages;

namespace CommunityCar.Application.Features.Stories.DTOs;

public class StoryDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public StoryUserDto User { get; set; } = null!;
    
    public string? PageId { get; set; }
    public StoryPageDto? Page { get; set; }
    
    public string MediaUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public StoryType Type { get; set; }
    public string? Caption { get; set; }
    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsActive { get; set; }
    public bool IsArchived { get; set; }
    
    public StoryVisibility Visibility { get; set; }
    
    public int ViewCount { get; set; }
    public int LikeCount { get; set; }
    public int ReplyCount { get; set; }
    
    public bool IsViewed { get; set; }
    public bool IsLiked { get; set; }
    public bool CanView { get; set; } = true;
}

public class StoryUserDto
{
    public string Id { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsVerified { get; set; }
}

public class StoryPageDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public bool IsVerified { get; set; }
    public PageCategory Category { get; set; }
}

public class CreateStoryRequest
{
    public string? PageId { get; set; }
    public string MediaUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public StoryType Type { get; set; } = StoryType.Image;
    public string? Caption { get; set; }
    public string? BackgroundColor { get; set; }
    public string? TextColor { get; set; }
    public StoryVisibility Visibility { get; set; } = StoryVisibility.Public;
    public List<string> ViewerIds { get; set; } = new();
}

public class StoryViewDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public StoryUserDto User { get; set; } = null!;
    public DateTime ViewedAt { get; set; }
}

public class StoryReplyDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public StoryUserDto User { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public StoryReplyType Type { get; set; }
    public DateTime CreatedAt { get; set; }
}