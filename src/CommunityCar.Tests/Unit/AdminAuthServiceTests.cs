using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.Common.Interfaces.Auth.Admin;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Application.DTOs.Requests.Auth.Admin; using CommunityCar.Application.DTOs.Response.Auth.Admin;
using CommunityCar.Application.DTOs.Requests.Auth.Common; using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using CommunityCar.Infrastructure.Services.Auth.Admin;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;
using Xunit;

namespace CommunityCar.Tests.Unit;

public class AdminAuthServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<SignInManager<ApplicationUser>> _signInManagerMock;
    private readonly Mock<IJwtService> _jwtServiceMock;
    private readonly Mock<ISecurityService> _securityServiceMock; // Usually not needed for AdminLogin but kept if needed
    private readonly Mock<IDeviceService> _deviceServiceMock;
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly AdminAuthService _adminAuthService;
    // AppDbContext is needed for AdminAuthService constructor?
    // Let's check AdminAuthService constructor.
    // public AdminAuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IJwtService jwtService, ILogger<AdminAuthService> logger)
    // Wait, I need to check AdminAuthService constructor signature from previous view_file.

    private readonly Mock<Microsoft.Extensions.Logging.ILogger<AdminAuthService>> _loggerMock;

    public AdminAuthServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        var contextAccessorMock = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
        var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
        _signInManagerMock = new Mock<SignInManager<ApplicationUser>>(
            _userManagerMock.Object, contextAccessorMock.Object, claimsFactoryMock.Object, null!, null!, null!, null!);

        _jwtServiceMock = new Mock<IJwtService>();
        _deviceServiceMock = new Mock<IDeviceService>();
        _securityServiceMock = new Mock<ISecurityService>(); // Initialize it
        _auditServiceMock = new Mock<IAuditService>();
        _auditServiceMock = new Mock<IAuditService>();
        _loggerMock = new Mock<Microsoft.Extensions.Logging.ILogger<AdminAuthService>>();

        _adminAuthService = new AdminAuthService(
            _userManagerMock.Object,
            _signInManagerMock.Object,
            _jwtServiceMock.Object,
            _securityServiceMock.Object,
            _auditServiceMock.Object,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task AdminLoginAsync_WithValidAdminCredentials_ReturnsResponse()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = "admin@test.com",
            AccountStatus = AccountStatus.Active
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync("admin@test.com")).ReturnsAsync(user);
        _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, "AdminPass!23", true)).ReturnsAsync(SignInResult.Success);
        
        // Setup Admin Role
        _userManagerMock.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(new List<string> { "SuperAdmin" });

         _jwtServiceMock
            .Setup(x => x.GenerateTokensAsync(user, It.IsAny<IList<string>>(), null))
            .ReturnsAsync(new TokenResult("access-token", "refresh-token", DateTime.UtcNow.AddHours(1), DateTime.UtcNow.AddDays(7)));

        _userManagerMock.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _adminAuthService.AdminLoginAsync(new AdminLoginRequest { Email = "admin@test.com", Password = "AdminPass!23" });

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().Be("access-token");
        result.AdminRoleType.Should().Be(AdminRoleType.SuperAdmin);
    }

    [Fact]
    public async Task AdminLoginAsync_WithNonAdminUser_ThrowsUnauthorized()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            AccountStatus = AccountStatus.Active
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync("user@test.com")).ReturnsAsync(user);
        _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, "UserPass!23", true)).ReturnsAsync(SignInResult.Success);
        
        // Setup User Role (Non-Admin)
        _userManagerMock.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(new List<string> { "User" });

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _adminAuthService.AdminLoginAsync(new AdminLoginRequest { Email = "user@test.com", Password = "UserPass!23" })
        );
        
        // Ensure SignOut is called
        _signInManagerMock.Verify(x => x.SignOutAsync(), Times.Once);
    }

    [Fact]
    public async Task AdminLoginAsync_WithInvalidCredentials_ThrowsUnauthorized()
    {
        // Arrange
        _userManagerMock.Setup(x => x.FindByEmailAsync("admin@test.com")).ReturnsAsync((ApplicationUser?)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _adminAuthService.AdminLoginAsync(new AdminLoginRequest { Email = "admin@test.com", Password = "Wrong" })
        );
    }
}
