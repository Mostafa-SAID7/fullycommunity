using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CommunityCar.Application.Features.Stories.DTOs;
using CommunityCar.Domain.Entities.Home;
using CommunityCar.Domain.Entities.Community.Pages;

namespace CommunityCar.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "community")]
public class StoriesController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<StoryDto>>> GetStories(
        [FromQuery] string? userId = null,
        [FromQuery] string? pageId = null,
        [FromQuery] bool includeExpired = false)
    {
        // Mock data for now - replace with actual service call
        var stories = GetMockStories();
        
        if (!string.IsNullOrEmpty(userId))
            stories = stories.Where(s => s.UserId == userId).ToList();
            
        if (!string.IsNullOrEmpty(pageId))
            stories = stories.Where(s => s.PageId == pageId).ToList();
            
        if (!includeExpired)
            stories = stories.Where(s => s.ExpiresAt > DateTime.UtcNow && s.IsActive).ToList();
        
        return Ok(stories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StoryDto>> GetStory(string id)
    {
        var story = GetMockStories().FirstOrDefault(s => s.Id == id);
        if (story == null)
            return NotFound();
            
        return Ok(story);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<StoryDto>> CreateStory([FromBody] CreateStoryRequest request)
    {
        // Mock creation - replace with actual service
        var story = new StoryDto
        {
            Id = Guid.NewGuid().ToString(),
            UserId = "current-user-id", // Get from auth context
            User = new StoryUserDto
            {
                Id = "current-user-id",
                FirstName = "Current",
                LastName = "User",
                AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                IsVerified = false
            },
            PageId = request.PageId,
            MediaUrl = request.MediaUrl,
            ThumbnailUrl = request.ThumbnailUrl,
            Type = request.Type,
            Caption = request.Caption,
            BackgroundColor = request.BackgroundColor,
            TextColor = request.TextColor,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            IsActive = true,
            IsArchived = false,
            Visibility = request.Visibility,
            ViewCount = 0,
            LikeCount = 0,
            ReplyCount = 0,
            IsViewed = false,
            IsLiked = false,
            CanView = true
        };
        
        return CreatedAtAction(nameof(GetStory), new { id = story.Id }, story);
    }

    [HttpPost("{id}/view")]
    [Authorize]
    public async Task<ActionResult> ViewStory(string id)
    {
        // Mock view tracking - replace with actual service
        return Ok(new { success = true, message = "Story viewed" });
    }

    [HttpPost("{id}/like")]
    [Authorize]
    public async Task<ActionResult> LikeStory(string id)
    {
        // Mock like - replace with actual service
        return Ok(new { success = true, message = "Story liked" });
    }

    [HttpDelete("{id}/like")]
    [Authorize]
    public async Task<ActionResult> UnlikeStory(string id)
    {
        // Mock unlike - replace with actual service
        return Ok(new { success = true, message = "Story unliked" });
    }

    [HttpGet("{id}/views")]
    [Authorize]
    public async Task<ActionResult<List<StoryViewDto>>> GetStoryViews(string id)
    {
        // Mock views - replace with actual service
        var views = new List<StoryViewDto>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = "user1",
                User = new StoryUserDto
                {
                    Id = "user1",
                    FirstName = "John",
                    LastName = "Doe",
                    AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100it=crop&crop=face"
                }           
            }
        };
      return Ok(views);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteStory(string id)
    {
        // Mock deletion - replace with actual service
        return Ok(new { success = true, message = "Story deleted" });
    }

    private static List<StoryDto> GetMockStories()
    {
        return new List<StoryDto>
        {
            new()
            {
                Id = "1",
                UserId = "user1",
                User = new StoryUserDto
                {
                    Id = "user1",
                    FirstName = "John",
                    LastName = "Doe",
                    AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                    IsVerified = false
                },
                MediaUrl = "https://images.unsplash.com/photo-1549927681-0b673b922a7b?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1549927681-0b673b922a7b?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "Just finished detailing my ride! ✨",
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                ExpiresAt = DateTime.UtcNow.AddHours(22),
                IsActive = true,
                IsArchived = false,
                Visibility = StoryVisibility.Public,
                ViewCount = 45,
                LikeCount = 12,
                ReplyCount = 3,
                IsViewed = false,
                IsLiked = false,
                CanView = true
            },
            new()
            {
                Id = "2",
                UserId = "user2",
                User = new StoryUserDto
                {
                    Id = "user2",
                    FirstName = "Alice",
                    LastName = "Smith",
                    AvatarUrl = "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
                    IsVerified = true
                },
                PageId = "page1",
                Page = new StoryPageDto
                {
                    Id = "page1",
                    Name = "AutoMax Dealership",
                    Username = "automax_official",
                    ProfileImageUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
                    IsVerified = true,
                    Category = PageCategory.CarDealer
                },
                MediaUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "New 2024 models just arrived! Come check them out 🚗",
                CreatedAt = DateTime.UtcNow.AddHours(-1),
                ExpiresAt = DateTime.UtcNow.AddHours(23),
                IsActive = true,
                IsArchived = false,
                Visibility = StoryVisibility.Public,
                ViewCount = 128,
                LikeCount = 34,
                ReplyCount = 8,
                IsViewed = false,
                IsLiked = false,
                CanView = true
            },
            new()
            {
                Id = "3",
                UserId = "user3",
                User = new StoryUserDto
                {
                    Id = "user3",
                    FirstName = "Bob",
                    LastName = "Wilson",
                    AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                    IsVerified = false
                },
                MediaUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "Track day was amazing! 🏁",
                CreatedAt = DateTime.UtcNow.AddHours(-4),
                ExpiresAt = DateTime.UtcNow.AddHours(20),
                IsActive = true,
                IsArchived = false,
                Visibility = StoryVisibility.Public,
                ViewCount = 67,
                LikeCount = 23,
                ReplyCount = 5,
                IsViewed = true,
                IsLiked = false,
                CanView = true
            },
            new()
            {
                Id = "4",
                UserId = "user4",
                User = new StoryUserDto
                {
                    Id = "user4",
                    FirstName = "Emma",
                    LastName = "Davis",
                    AvatarUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                    IsVerified = false
                },
                MediaUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "Sunday drive with the family 🌟",
                CreatedAt = DateTime.UtcNow.AddHours(-6),
                ExpiresAt = DateTime.UtcNow.AddHours(18),
                IsActive = true,
                IsArchived = false,
                Visibility = StoryVisibility.Public,
                ViewCount = 89,
                LikeCount = 31,
                ReplyCount = 7,
                IsViewed = false,
                IsLiked = true,
                CanView = true
            },
            new()
            {
                Id = "5",
                UserId = "user5",
                User = new StoryUserDto
                {
                    Id = "user5",
                    FirstName = "Mike",
                    LastName = "Chen",
                    AvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
                    IsVerified = false
                },
                MediaUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
                ThumbnailUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop",
                Type = StoryType.Image,
                Caption = "Electric future is here! ⚡",
                CreatedAt = DateTime.UtcNow.AddMinutes(-30),
                ExpiresAt = DateTime.UtcNow.AddHours(23).AddMinutes(30),
                IsActive = true,
                IsArchived = false,
                Visibility = StoryVisibility.Public,
                ViewCount = 156,
                LikeCount = 42,
                ReplyCount = 12,
                IsViewed = false,
                IsLiked = false,
                CanView = true
            }
        };
    }
}