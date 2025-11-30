using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Features.Pages;

// Page DTOs
public record PageDto(
    Guid Id,
    string Title,
    string Slug,
    string? MetaTitle,
    string? MetaDescription,
    string Content,
    string? Summary,
    string? FeaturedImageUrl,
    PageType Type,
    PageStatus Status,
    PageVisibility Visibility,
    Guid? ParentPageId,
    string? ParentPageTitle,
    string? Template,
    DateTime? PublishedAt,
    string? AuthorName,
    bool ShowInNavigation,
    bool ShowInFooter,
    int ViewCount,
    List<PageSectionDto> Sections,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record PageListItemDto(
    Guid Id,
    string Title,
    string Slug,
    PageType Type,
    PageStatus Status,
    DateTime? PublishedAt,
    int ViewCount,
    bool ShowInNavigation,
    bool ShowInFooter
);

public record PageSectionDto(
    Guid Id,
    string? Title,
    string? Subtitle,
    SectionType Type,
    string? Content,
    string? ContentJson,
    string? BackgroundImageUrl,
    string? BackgroundColor,
    int SortOrder,
    bool IsVisible,
    bool IsFullWidth
);

public record PageRevisionDto(
    Guid Id,
    int RevisionNumber,
    string Title,
    string Content,
    string? AuthorName,
    string? ChangeNote,
    bool IsPublished,
    DateTime CreatedAt
);

// Request DTOs
public record PageSearchRequest(
    string? Query,
    PageType? Type,
    PageStatus? Status,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreatePageRequest(
    string Title,
    string? MetaTitle,
    string? MetaDescription,
    string Content,
    string? Summary,
    string? FeaturedImageUrl,
    PageType Type,
    PageVisibility Visibility,
    Guid? ParentPageId,
    string? Template,
    bool ShowInNavigation,
    bool ShowInFooter,
    bool AllowComments
);

public record UpdatePageRequest(
    string? Title,
    string? MetaTitle,
    string? MetaDescription,
    string? Content,
    string? Summary,
    string? FeaturedImageUrl,
    PageType? Type,
    PageVisibility? Visibility,
    Guid? ParentPageId,
    string? Template,
    string? CustomCss,
    string? CustomJs,
    bool? ShowInNavigation,
    bool? ShowInFooter,
    bool? AllowComments,
    string? ChangeNote
);

public record CreateSectionRequest(
    string? Title,
    string? Subtitle,
    SectionType Type,
    string? Content,
    string? ContentJson,
    string? BackgroundImageUrl,
    string? BackgroundColor,
    string? CssClasses,
    bool IsFullWidth
);

public record UpdateSectionRequest(
    string? Title,
    string? Subtitle,
    SectionType? Type,
    string? Content,
    string? ContentJson,
    string? BackgroundImageUrl,
    string? BackgroundColor,
    string? CssClasses,
    bool? IsVisible,
    bool? IsFullWidth
);
