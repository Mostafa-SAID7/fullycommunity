using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.Common.Interfaces.Auth.User;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Application.DTOs.Requests.Auth.Common; using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.User; using CommunityCar.Application.DTOs.Response.Auth.User;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Domain.Enums;
using CommunityCar.Infrastructure.Services.Auth.User;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace CommunityCar.Tests.Unit;

public class AuthServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<SignInManager<ApplicationUser>> _signInManagerMock;
    private readonly Mock<IJwtService> _jwtServiceMock;
    private readonly Mock<ISecurityService> _securityServiceMock;
    private readonly Mock<IDeviceService> _deviceServiceMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!
        );

        var contextAccessorMock = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
        var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
        _signInManagerMock = new Mock<SignInManager<ApplicationUser>>(
            _userManagerMock.Object,
            contextAccessorMock.Object,
            claimsFactoryMock.Object,
            null!,
            null!,
            null!,
            null!
        );

        _jwtServiceMock = new Mock<IJwtService>();
        _securityServiceMock = new Mock<ISecurityService>();
        _deviceServiceMock = new Mock<IDeviceService>();
        _notificationServiceMock = new Mock<INotificationService>();
        _auditServiceMock = new Mock<IAuditService>();
        _loggerMock = new Mock<ILogger<AuthService>>();

        _authService = new AuthService(
            _userManagerMock.Object,
            _signInManagerMock.Object,
            _jwtServiceMock.Object,
            _securityServiceMock.Object,
            _deviceServiceMock.Object,
            _notificationServiceMock.Object,
            _auditServiceMock.Object,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsLoginResponse()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            FirstName = "Test",
            LastName = "User",
            AccountStatus = AccountStatus.Active,
            UserType = UserType.User
        };

        _userManagerMock
            .Setup(x => x.FindByEmailAsync("test@test.com"))
            .ReturnsAsync(user);

        _signInManagerMock
            .Setup(x => x.CheckPasswordSignInAsync(user, "Password123!", true))
            .ReturnsAsync(SignInResult.Success);

        _userManagerMock
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(["User"]);

        _jwtServiceMock
            .Setup(x => x.GenerateTokensAsync(user, null, null))
            .ReturnsAsync(new TokenResult("access-token", "refresh-token", DateTime.UtcNow.AddHours(1), DateTime.UtcNow.AddDays(7)));

        _userManagerMock
            .Setup(x => x.UpdateAsync(user))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _authService.LoginAsync(new LoginRequest("test@test.com", "Password123!"));

        // Assert
        result.Should().NotBeNull();
        result.AccessToken.Should().Be("access-token");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidCredentials_ThrowsUnauthorized()
    {
        // Arrange
        _userManagerMock
            .Setup(x => x.FindByEmailAsync("test@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _authService.LoginAsync(new LoginRequest("test@test.com", "wrong"))
        );
    }

    [Fact]
    public async Task RegisterAsync_WithNewEmail_CreatesUser()
    {
        // Arrange
        _userManagerMock
            .Setup(x => x.FindByEmailAsync("new@test.com"))
            .ReturnsAsync((ApplicationUser?)null);

        _userManagerMock
            .Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), "Password123!"))
            .ReturnsAsync(IdentityResult.Success);

        _userManagerMock
            .Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), "User"))
            .ReturnsAsync(IdentityResult.Success);

        _userManagerMock
            .Setup(x => x.GenerateEmailConfirmationTokenAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync("confirmation-token");

        var request = new RegisterRequest("new@test.com", "Password123!", "New", "User");

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.RequiresVerification.Should().BeTrue();
        _userManagerMock.Verify(x => x.CreateAsync(It.IsAny<ApplicationUser>(), "Password123!"), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ThrowsInvalidOperation()
    {
        // Arrange
        var existingUser = new ApplicationUser { Email = "existing@test.com" };
        _userManagerMock
            .Setup(x => x.FindByEmailAsync("existing@test.com"))
            .ReturnsAsync(existingUser);

        var request = new RegisterRequest("existing@test.com", "Password123!", "Test", "User");

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _authService.RegisterAsync(request)
        );
    }



}

