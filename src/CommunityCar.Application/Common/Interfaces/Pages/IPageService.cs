using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Pages;

namespace CommunityCar.Application.Common.Interfaces.Pages;

public interface IPageService
{
    // Pages
    Task<PageDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PageDto?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<PagedResult<PageListItemDto>> SearchAsync(PageSearchRequest request, CancellationToken ct = default);
    Task<List<PageListItemDto>> GetNavigationPagesAsync(CancellationToken ct = default);
    Task<List<PageListItemDto>> GetFooterPagesAsync(CancellationToken ct = default);
    Task<List<PageListItemDto>> GetChildPagesAsync(Guid parentId, CancellationToken ct = default);
    
    Task<PageDto> CreateAsync(CreatePageRequest request, Guid authorId, CancellationToken ct = default);
    Task<PageDto> UpdateAsync(Guid id, UpdatePageRequest request, Guid modifiedById, CancellationToken ct = default);
    Task PublishAsync(Guid id, CancellationToken ct = default);
    Task UnpublishAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    Task RecordViewAsync(Guid id, CancellationToken ct = default);
    
    // Sections
    Task<List<PageSectionDto>> GetSectionsAsync(Guid pageId, CancellationToken ct = default);
    Task<PageSectionDto> AddSectionAsync(Guid pageId, CreateSectionRequest request, CancellationToken ct = default);
    Task<PageSectionDto> UpdateSectionAsync(Guid sectionId, UpdateSectionRequest request, CancellationToken ct = default);
    Task DeleteSectionAsync(Guid sectionId, CancellationToken ct = default);
    Task ReorderSectionsAsync(Guid pageId, List<Guid> sectionIds, CancellationToken ct = default);
    
    // Revisions
    Task<List<PageRevisionDto>> GetRevisionsAsync(Guid pageId, CancellationToken ct = default);
    Task<PageRevisionDto?> GetRevisionAsync(Guid revisionId, CancellationToken ct = default);
    Task RestoreRevisionAsync(Guid revisionId, Guid modifiedById, CancellationToken ct = default);
}
