namespace CommunityCar.Application.Common.Security;

public interface IAuthorizeableRequest
{
    Guid UserId { get; }
}
