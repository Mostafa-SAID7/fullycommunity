using CommunityCar.Domain.Entities.Community.Groups;

namespace CommunityCar.Application.DTOs.Requests.Community.Groups;

public record UpdateMemberRoleRequest(GroupRole Role);
