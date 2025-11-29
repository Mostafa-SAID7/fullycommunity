using CommunityCar.Application.DTOs;
using CommunityCar.Application.Services;
using CommunityCar.Domain.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;

namespace CommunityCar.Tests.Unit;

public class AuthServiceTests
{
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<SignInManager<User>> _signInManagerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var userStoreMock = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        var contextAccessorMock = new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
        var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<User>>();
        _signInManagerMock = new Mock<SignInManager<User>>(
            _userManagerMock.Object, contextAccessorMock.Object, claimsFactoryMock.Object, null!, null!, null!, null!);

        _configurationMock = new Mock<IConfiguration>();
        _configurationMock.Setup(c => c["Jwt:Secret"]).Returns("YourSuperSecretKeyHere_MustBeAtLeast32Characters!");
        _configurationMock.Setup(c => c["Jwt:Issuer"]).Returns("CommunityCar");
        _configurationMock.Setup(c => c["Jwt:Audience"]).Returns("CommunityCar");
        _configurationMock.Setup(c => c["Jwt:ExpirationMinutes"]).Returns("60");

        _authService = new AuthService(_userManagerMock.Object, _signInManagerMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var user = new User { Id = Guid.NewGuid(), Email = "test@test.com", FirstName = "Test", LastName = "User", IsActive = true };
        _userManagerMock.Setup(x => x.FindByEmailAsync("test@test.com")).ReturnsAsync(user);
        _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, "Password123", false))
            .ReturnsAsync(SignInResult.Success);
        _userManagerMock.Setup(x => x.GetRolesAsync(user)).ReturnsAsync(new List<string> { "User" });

        // Act
        var result = await _authService.LoginAsync(new LoginDto("test@test.com", "Password123"));

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.User.Email.Should().Be("test@test.com");
    }

    [Fact]
    public async Task LoginAsync_WithInvalidCredentials_ThrowsUnauthorized()
    {
        // Arrange
        _userManagerMock.Setup(x => x.FindByEmailAsync("test@test.com")).ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _authService.LoginAsync(new LoginDto("test@test.com", "wrong")));
    }

    [Fact]
    public async Task RegisterAsync_WithNewEmail_CreatesUser()
    {
        // Arrange
        _userManagerMock.Setup(x => x.FindByEmailAsync("new@test.com")).ReturnsAsync((User?)null);
        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), "Password123!"))
            .ReturnsAsync(IdentityResult.Success);
        _userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);
        _userManagerMock.Setup(x => x.GetRolesAsync(It.IsAny<User>()))
            .ReturnsAsync(new List<string> { "User" });

        var dto = new RegisterDto("new@test.com", "Password123!", "New", "User", null);

        // Act
        var result = await _authService.RegisterAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ThrowsInvalidOperation()
    {
        // Arrange
        var existingUser = new User { Email = "existing@test.com" };
        _userManagerMock.Setup(x => x.FindByEmailAsync("existing@test.com")).ReturnsAsync(existingUser);

        var dto = new RegisterDto("existing@test.com", "Password123!", "Test", "User", null);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _authService.RegisterAsync(dto));
    }

    [Fact]
    public async Task GetUserByIdAsync_WithValidId_ReturnsUser()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User { Id = userId, Email = "test@test.com", FirstName = "Test", LastName = "User" };
        _userManagerMock.Setup(x => x.FindByIdAsync(userId.ToString())).ReturnsAsync(user);

        // Act
        var result = await _authService.GetUserByIdAsync(userId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(userId);
    }

    [Fact]
    public async Task GetUserByIdAsync_WithInvalidId_ReturnsNull()
    {
        // Arrange
        _userManagerMock.Setup(x => x.FindByIdAsync(It.IsAny<string>())).ReturnsAsync((User?)null);

        // Act
        var result = await _authService.GetUserByIdAsync(Guid.NewGuid());

        // Assert
        result.Should().BeNull();
    }
}
