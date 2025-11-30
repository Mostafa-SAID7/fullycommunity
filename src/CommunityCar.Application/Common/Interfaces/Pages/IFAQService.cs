using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Common.Interfaces.Pages;

public interface IFAQService
{
    Task<FAQDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<FAQDto>> SearchAsync(FAQSearchRequest request, CancellationToken ct = default);
    Task<List<FAQDto>> GetByCategoryAsync(FAQCategory category, CancellationToken ct = default);
    Task<List<FAQDto>> GetFeaturedAsync(int count = 10, CancellationToken ct = default);
    Task<List<FAQCategoryCountDto>> GetCategoryCountsAsync(CancellationToken ct = default);
    
    Task<FAQDto> CreateAsync(CreateFAQRequest request, CancellationToken ct = default);
    Task<FAQDto> UpdateAsync(Guid id, UpdateFAQRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    
    Task RecordViewAsync(Guid id, CancellationToken ct = default);
    Task RecordFeedbackAsync(Guid id, bool isHelpful, CancellationToken ct = default);
}
