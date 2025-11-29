using CommunityCar.Application.Features.Identity.Commands.Login;
using CommunityCar.Domain.Entities.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace CommunityCar.Application.Features.Identity.Queries.GetCurrentUser;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserDto?>
{
    private readonly UserManager<ApplicationUser> _userManager;

    public GetCurrentUserQueryHandler(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<UserDto?> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        
        if (user == null || user.IsDeleted)
            return null;

        var roles = await _userManager.GetRolesAsync(user);

        return new UserDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.AvatarUrl,
            user.UserType.ToString(),
            user.IsVerified,
            roles
        );
    }
}
