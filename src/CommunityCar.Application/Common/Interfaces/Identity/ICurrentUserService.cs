namespace CommunityCar.Application.Common.Interfaces.Identity;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    string? DeviceId { get; }
    string? IpAddress { get; }
    bool IsAuthenticated { get; }
    IEnumerable<string> Roles { get; }
}
