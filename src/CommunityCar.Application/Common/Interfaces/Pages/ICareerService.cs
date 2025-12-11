using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Response.Pages;
using CommunityCar.Application.DTOs.Requests.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Common.Interfaces.Pages;

public interface ICareerService
{
    // Positions
    Task<CareerPositionDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<CareerPositionDto?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<PagedResult<CareerPositionListItemDto>> SearchAsync(CareerSearchRequest request, CancellationToken ct = default);
    Task<List<CareerPositionListItemDto>> GetFeaturedAsync(int count = 5, CancellationToken ct = default);
    Task<List<string>> GetDepartmentsAsync(CancellationToken ct = default);
    Task<List<string>> GetLocationsAsync(CancellationToken ct = default);
    
    Task<CareerPositionDto> CreateAsync(CreateCareerPositionRequest request, CancellationToken ct = default);
    Task<CareerPositionDto> UpdateAsync(Guid id, UpdateCareerPositionRequest request, CancellationToken ct = default);
    Task PublishAsync(Guid id, CancellationToken ct = default);
    Task UnpublishAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    Task RecordViewAsync(Guid id, CancellationToken ct = default);
    
    // Applications
    Task<CareerApplicationDto?> GetApplicationByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<CareerApplicationListItemDto>> GetApplicationsAsync(Guid positionId, ApplicationSearchRequest request, CancellationToken ct = default);
    Task<CareerApplicationDto> ApplyAsync(Guid positionId, CreateApplicationRequest request, Guid? userId, CancellationToken ct = default);
    Task<CareerApplicationDto> UpdateApplicationStatusAsync(Guid id, ApplicationStatus status, string? notes, Guid reviewerId, CancellationToken ct = default);
    Task<CareerApplicationDto> RateApplicationAsync(Guid id, int rating, string? notes, Guid reviewerId, CancellationToken ct = default);
}
