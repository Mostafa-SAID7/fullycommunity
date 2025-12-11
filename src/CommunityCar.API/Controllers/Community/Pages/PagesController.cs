using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CommunityCar.Application.DTOs.Response.Community.Pages;
using CommunityCar.Application.DTOs.Requests.Community.Pages;
using CommunityCar.Domain.Entities.Community.Pages;
using CommunityCar.Domain.Enums.Community.Pages;

namespace CommunityCar.API.Controllers;

[ApiController]
[Route("api/community/[controller]")]
[ApiExplorerSettings(GroupName = "community")]
public class PagesController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<PageListDto>>> GetPages(
        [FromQuery] PageCategory? category = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool? isVerified = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        // Mock data for now - replace with actual service call
        var pages = GetMockPages();
        
        if (category.HasValue)
            pages = pages.Where(p => p.Category == category.Value).ToList();
            
        if (!string.IsNullOrEmpty(searchTerm))           pages = pages.Where(p => p.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                                   p.Description?.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) == true).ToList();
                                   
        if (isVerified.HasValue)
            pages = pages.Where(p => p.IsVerified == isVerified.Value).ToList();
        
        var totalCount = pages.Count;
        var pagedPages = pages.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        
        return Ok(new
        {
            Items = pagedPages,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PageDto>> GetPage(string id)
    {
        var page = GetMockPageDetails().FirstOrDefault(p => p.Id == id);
        if (page == null)
            return NotFound();
            
        return Ok(page);
    }

    [HttpGet("username/{username}")]
    public async Task<ActionResult<PageDto>> GetPageByUsername(string username)
    {
        var page = GetMockPageDetails().FirstOrDefault(p => p.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        if (page == null)
            return NotFound();
            
        return Ok(page);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PageDto>> CreatePage([FromBody] CommunityCar.Application.DTOs.Requests.Community.Pages.CreatePageRequest request)
    {
        // Mock creation - replace with actual service
        var page = new PageDto
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Username = request.Username,
            Description = request.Description,
            Bio = request.Bio,
            Category = request.Category,
            Type = request.Type,
            IsVerified = false,
            IsPublic = request.IsPublic,
            Email = request.Email,
            Phone = request.Phone,
            Website = request.Website,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Country = request.Country,
            Owner = new PageOwnerDto
            {
                Id = "current-user-id", // Get from auth context
                FirstName = "Current",
                LastName = "User",
                IsVerified = false
            },
            FollowerCount = 0,
            PostCount = 0,
            StoryCount = 0,
            AverageRating = 0,
            ReviewCount = 0,
            IsFollowing = false,
            IsOwner = true,
            IsAdmin = true,
            CreatedAt = DateTime.UtcNow
        };
        
        return CreatedAtAction(nameof(GetPage), new { id = page.Id }, page);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<PageDto>> UpdatePage(string id, [FromBody] CommunityCar.Application.DTOs.Requests.Community.Pages.UpdatePageRequest request)
    {
        var page = GetMockPageDetails().FirstOrDefault(p => p.Id == id);
        if (page == null)
            return NotFound();
            
        // Mock update - replace with actual service
        if (!string.IsNullOrEmpty(request.Name)) page.Name = request.Name;
        if (!string.IsNullOrEmpty(request.Description)) page.Description = request.Description;
        if (!string.IsNullOrEmpty(request.Bio)) page.Bio = request.Bio;
        // ... update other fields
        
        return Ok(page);
    }

    [HttpPost("{id}/follow")]
    [Authorize]
    public async Task<ActionResult> FollowPage(string id)
    {
        // Mock follow - replace with actual service
        return Ok(new { success = true, message = "Page followed" });
    }

    [HttpDelete("{id}/follow")]
    [Authorize]
    public async Task<ActionResult> UnfollowPage(string id)
    {
        // Mock unfollow - replace with actual service
        return Ok(new { success = true, message = "Page unfollowed" });
    }

    [HttpGet("{id}/reviews")]
    public async Task<ActionResult<List<PageReviewDto>>> GetPageReviews(string id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // Mock reviews - replace with actual service
        var reviews = new List<PageReviewDto>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = "user1",
                User = new PageOwnerDto
                {
                    Id = "user1",
                    FirstName = "John",
                    LastName = "Doe",
                    IsVerified = false
                },
                Rating = 5,
                Title = "Excellent service!",
                Content = "Great experience with this dealership. Highly recommended!",
                HelpfulCount = 12,
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            }
        };
        
        return Ok(reviews);
    }

    [HttpPost("{id}/reviews")]
    [Authorize]
    public async Task<ActionResult<PageReviewDto>> CreateReview(string id, [FromBody] CreatePageReviewRequest request)
    {
        // Mock review creation - replace with actual service
        var review = new PageReviewDto
        {
            Id = Guid.NewGuid().ToString(),
            UserId = "current-user-id",
            User = new PageOwnerDto
            {
                Id = "current-user-id",
                FirstName = "Current",
                LastName = "User",
                IsVerified = false
            },
            Rating = request.Rating,
            Title = request.Title,
            Content = request.Content,
            ImageUrls = request.ImageUrls ?? new List<string>(),
            HelpfulCount = 0,
            CreatedAt = DateTime.UtcNow
        };
        
        return CreatedAtAction(nameof(GetPageReviews), new { id }, review);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> DeletePage(string id)
    {
        // Mock deletion - replace with actual service
        return Ok(new { success = true, message = "Page deleted" });
    }

    private static List<PageListDto> GetMockPages()
    {
        return new List<PageListDto>
        {
            new()
            {
                Id = "page1",
                Name = "AutoMax Dealership",
                Username = "automax_official",
                Description = "Your trusted car dealership since 1995. New and used vehicles.",
                ProfileImageUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
                Category = PageCategory.CarDealer,
                IsVerified = true,
                FollowerCount = 15420,
                AverageRating = 4.8,
                IsFollowing = false
            },
            new()
            {
                Id = "page2",
                Name = "Mike's Auto Repair",
                Username = "mikes_auto_repair",
                Description = "Professional auto repair services. 20+ years experience.",
                ProfileImageUrl = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop",
                Category = PageCategory.AutoRepair,
                IsVerified = false,
                FollowerCount = 3200,
                AverageRating = 4.6,
                IsFollowing = true
            },
            new()
            {
                Id = "page3",
                Name = "CarParts Plus",
                Username = "carparts_plus",
                Description = "Quality auto parts and accessories. Fast shipping nationwide.",
                ProfileImageUrl = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop",
                Category = PageCategory.AutoParts,
                IsVerified = true,
                FollowerCount = 8900,
                AverageRating = 4.4,
                IsFollowing = false
            }
        };
    }

    private static List<PageDto> GetMockPageDetails()
    {
        return new List<PageDto>
        {
            new()
            {
                Id = "page1",
                Name = "AutoMax Dealership",
                Username = "automax_official",
                Description = "Your trusted car dealership since 1995. New and used vehicles.",
                Bio = "Family-owned dealership serving the community for over 25 years. We specialize in quality pre-owned vehicles and exceptional customer service.",
                ProfileImageUrl = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
                CoverImageUrl = "https://images.unsplash.com/photo-1562141961-d0a6b5b8c3b8?w=800&h=300&fit=crop",
                Category = PageCategory.CarDealer,
                Type = PageType.Business,
                IsVerified = true,
                IsPublic = true,
                Email = "info@automax.com",
                Phone = "(555) 123-4567",
                Website = "https://automax.com",
                Address = "123 Main Street",
                City = "Springfield",
                State = "IL",
                Country = "USA",
                BusinessHours = "Mon-Fri: 9AM-7PM, Sat: 9AM-6PM, Sun: 12PM-5PM",
                FacebookUrl = "https://facebook.com/automax",
                InstagramUrl = "https://instagram.com/automax_official",
                Owner = new PageOwnerDto
                {
                    Id = "owner1",
                    FirstName = "Robert",
                    LastName = "Johnson",
                    AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                    IsVerified = false
                },
                FollowerCount = 15420,
                PostCount = 234,
                StoryCount = 12,
                AverageRating = 4.8,
                ReviewCount = 156,
                IsFollowing = false,
                IsOwner = false,
                IsAdmin = false,
                CreatedAt = DateTime.UtcNow.AddYears(-2)
            }
        };
    }
}

public class CreatePageReviewRequest
{
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<string>? ImageUrls { get; set; }
}
