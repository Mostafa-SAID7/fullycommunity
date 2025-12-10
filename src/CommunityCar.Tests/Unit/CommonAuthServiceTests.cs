using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Auth.Common;
using CommunityCar.Application.Common.Interfaces.Security;
using CommunityCar.Application.Common.Models;
using CommunityCar.Application.DTOs.Requests.Auth.Common; using CommunityCar.Application.DTOs.Response.Auth.Common;
using CommunityCar.Application.DTOs.Requests.Auth.User; using CommunityCar.Application.DTOs.Response.Auth.User;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Services.Auth.Common;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;
using Xunit;

namespace CommunityCar.Tests.Unit;

public class CommonAuthServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<IJwtService> _jwtServiceMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<IAuditService> _auditServiceMock;
    private readonly Mock<Microsoft.Extensions.Logging.ILogger<CommonAuthService>> _loggerMock;
    private readonly CommonAuthService _commonAuthService;

    public CommonAuthServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        _jwtServiceMock = new Mock<IJwtService>();
        _notificationServiceMock = new Mock<INotificationService>();
        _auditServiceMock = new Mock<IAuditService>();
        _loggerMock = new Mock<Microsoft.Extensions.Logging.ILogger<CommonAuthService>>();

        _commonAuthService = new CommonAuthService(
            _userManagerMock.Object,
            _jwtServiceMock.Object,
            _notificationServiceMock.Object,
            _auditServiceMock.Object,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task LogoutAsync_CallsRevokeAllTokens()
    {
        // Arrange
        var userId = Guid.NewGuid();

        // Act
        await _commonAuthService.LogoutAsync(userId);

        // Assert
        _jwtServiceMock.Verify(x => x.RevokeAllUserTokensAsync(userId), Times.Once);
        _auditServiceMock.Verify(x => x.LogAsync("Logout", "User", userId.ToString(), userId, null), Times.Once);
    }

    [Fact]
    public async Task ChangePasswordAsync_WithValidData_ChangesPassword()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new ApplicationUser { Id = userId, Email = "test@test.com" };

        _userManagerMock.Setup(x => x.FindByIdAsync(userId.ToString())).ReturnsAsync(user);
        _userManagerMock.Setup(x => x.ChangePasswordAsync(user, "Old!", "New!")).ReturnsAsync(IdentityResult.Success);

        // Act
        await _commonAuthService.ChangePasswordAsync(userId, new ChangePasswordRequest("Old!", "New!"));

        // Assert
        _userManagerMock.Verify(x => x.ChangePasswordAsync(user, "Old!", "New!"), Times.Once);
        _jwtServiceMock.Verify(x => x.RevokeAllUserTokensAsync(userId), Times.Once);
    }
}
