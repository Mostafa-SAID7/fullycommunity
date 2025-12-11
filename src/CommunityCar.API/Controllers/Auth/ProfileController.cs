using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Application.DTOs.Requests.Auth.User;
using CommunityCar.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Auth;

[ApiController]
[Route("api/auth")]
[ApiExplorerSettings(GroupName = "identity")]
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (!string.IsNullOrEmpty(request.FirstName))
            user.FirstName = request.FirstName;
        if (!string.IsNullOrEmpty(request.LastName))
            user.LastName = request.LastName;
        if (request.PhoneNumber != null)
            user.PhoneNumber = request.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join(", ", result.Errors.Select(e => e.Description)) });

        return Ok(new { message = "Profile updated successfully" });
    }

    [HttpPost("me/avatar")]
    [Authorize]
    public async Task<IActionResult> UploadAvatar(IFormFile file, [FromServices] IFileStorageService fileStorage)
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file provided" });

        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return BadRequest(new { message = "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." });

        // Max 5MB
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "File size must be less than 5MB" });

        var storedFile = await fileStorage.UploadAsync(file, Domain.Entities.Storage.FileCategory.Avatar, userId, "User");
        user.AvatarUrl = storedFile.Url;
        await _userManager.UpdateAsync(user);

        return Ok(new { avatarUrl = storedFile.Url, message = "Avatar updated successfully" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            return NotFound(new { message = "User not found" });

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            phoneNumber = user.PhoneNumber,
            avatarUrl = user.AvatarUrl,
            roles
        });
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
