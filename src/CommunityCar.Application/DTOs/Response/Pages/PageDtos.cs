using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.DTOs.Response.Pages;

public record FAQDto(
    Guid Id,
    string Question,
    string Answer,
    FAQCategory Category,
    List<string> Tags,
    int SortOrder,
    bool IsPublished,
    bool IsFeatured,
    int ViewCount,
    int HelpfulCount,
    int NotHelpfulCount,
    string? MetaTitle,
    string? MetaDescription,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record FAQCategoryCountDto(
    FAQCategory Category,
    int Count
);

public record LegalDocumentDto(
    Guid Id,
    string Title,
    string Slug,
    LegalDocumentType Type,
    string Content,
    string? Summary,
    string Version,
    DateTime EffectiveDate,
    DateTime? ExpiresAt,
    bool IsPublished,
    bool RequiresAcceptance,
    Guid? AuthorId,
    string? AuthorName,
    string? MetaTitle,
    string? MetaDescription,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record LegalDocumentListItemDto(
    Guid Id,
    string Title,
    string Slug,
    LegalDocumentType Type,
    string Version,
    DateTime EffectiveDate,
    bool IsPublished,
    bool RequiresAcceptance
);

public record LegalDocumentVersionDto(
    Guid Id,
    Guid LegalDocumentId,
    string Version,
    string Content,
    string? ChangeLog,
    DateTime EffectiveDate,
    Guid? AuthorId,
    string? AuthorName,
    DateTime CreatedAt
);

public record LegalAcceptanceDto(
    Guid Id,
    Guid UserId,
    Guid LegalDocumentId,
    string DocumentTitle,
    LegalDocumentType DocumentType,
    string AcceptedVersion,
    DateTime AcceptedAt,
    string? IpAddress
);

// Career DTOs
public record CareerPositionDto(
    Guid Id,
    string Title,
    string Slug,
    string Department,
    string Location,
    string EmploymentType,
    string ExperienceLevel,
    string Description,
    string Requirements,
    string? Benefits,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string? SalaryCurrency,
    bool IsRemote,
    bool IsPublished,
    bool IsFeatured,
    int ViewCount,
    int ApplicationCount,
    DateTime? Deadline,
    string? MetaTitle,
    string? MetaDescription,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CareerPositionListItemDto(
    Guid Id,
    string Title,
    string Slug,
    string Department,
    string Location,
    string EmploymentType,
    bool IsRemote,
    bool IsFeatured,
    DateTime? Deadline,
    DateTime CreatedAt
);

public record CareerApplicationDto(
    Guid Id,
    Guid PositionId,
    string PositionTitle,
    Guid? UserId,
    string FullName,
    string Email,
    string Phone,
    string? ResumeUrl,
    string? CoverLetter,
    string? LinkedInUrl,
    string? PortfolioUrl,
    ApplicationStatus Status,
    int? Rating,
    string? Notes,
    Guid? ReviewedById,
    string? ReviewedByName,
    DateTime? ReviewedAt,
    DateTime CreatedAt
);

public record CareerApplicationListItemDto(
    Guid Id,
    Guid PositionId,
    string FullName,
    string Email,
    ApplicationStatus Status,
    int? Rating,
    DateTime CreatedAt
);

// Contact DTOs
public record ContactSubmissionDto(
    Guid Id,
    Guid? UserId,
    string Name,
    string Email,
    string? Phone,
    string Subject,
    string Message,
    ContactType Type,
    ContactStatus Status,
    string? Notes,
    Guid? AssignedToId,
    string? AssignedToName,
    string? Response,
    DateTime? RespondedAt,
    string? IpAddress,
    DateTime CreatedAt
);

public record ContactStatsDto(
    int TotalSubmissions,
    int PendingCount,
    int InProgressCount,
    int ResolvedCount,
    int ClosedCount,
    decimal AverageResponseTimeHours
);

// About DTOs - Team
public record TeamMemberDto(
    Guid Id,
    string Name,
    string Title,
    string Department,
    string? Bio,
    string? PhotoUrl,
    string? Email,
    string? LinkedInUrl,
    string? TwitterUrl,
    bool IsLeadership,
    bool IsPublished,
    int SortOrder,
    DateTime CreatedAt
);

// About DTOs - Testimonials
public record TestimonialDto(
    Guid Id,
    string AuthorName,
    string? AuthorTitle,
    string? AuthorCompany,
    string? AuthorPhotoUrl,
    string Content,
    int? Rating,
    bool IsFeatured,
    bool IsPublished,
    DateTime CreatedAt
);

// About DTOs - Partners
public record PartnerDto(
    Guid Id,
    string Name,
    string? Description,
    string? LogoUrl,
    string? WebsiteUrl,
    PartnerType Type,
    bool IsFeatured,
    bool IsPublished,
    int SortOrder,
    DateTime CreatedAt
);

// Page DTOs
public record PageDto(
    Guid Id,
    string Title,
    string Slug,
    string Content,
    string? Summary,
    PageType Type,
    PageStatus Status,
    Guid? ParentId,
    bool ShowInNavigation,
    bool ShowInFooter,
    int SortOrder,
    string? FeaturedImageUrl,
    Guid AuthorId,
    string AuthorName,
    string? MetaTitle,
    string? MetaDescription,
    List<string>? MetaKeywords,
    int ViewCount,
    DateTime? PublishedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record PageListItemDto(
    Guid Id,
    string Title,
    string Slug,
    PageType Type,
    PageStatus Status,
    bool ShowInNavigation,
    bool ShowInFooter,
    int SortOrder,
    DateTime? PublishedAt,
    DateTime UpdatedAt
);

public record PageSectionDto(
    Guid Id,
    Guid PageId,
    string SectionType,
    string Title,
    string? Content,
    Dictionary<string, object>? Settings,
    int SortOrder,
    bool IsPublished,
    DateTime CreatedAt
);

public record PageRevisionDto(
    Guid Id,
    Guid PageId,
    string Title,
    string Content,
    string? Summary,
    Guid ModifiedById,
    string ModifiedByName,
    string? ChangeDescription,
    DateTime CreatedAt
);

// Menu DTOs
public record MenuItemDto(
    Guid Id,
    MenuLocation Location,
    string Label,
    string? Url,
    Guid? PageId,
    string? PageSlug,
    Guid? ParentId,
    string Target,
    string? Icon,
    int SortOrder,
    bool IsPublished,
    List<MenuItemDto>? Children
);

// Announcement DTOs
public record AnnouncementDto(
    Guid Id,
    string Title,
    string Content,
    string Type,
    string? BackgroundColor,
    string? TextColor,
    string? LinkUrl,
    string? LinkText,
    List<string>? TargetPages,
    bool IsGlobal,
    bool IsDismissible,
    bool IsActive,
    DateTime? StartDate,
    DateTime? EndDate,
    int ViewCount,
    int ClickCount,
    int DismissCount,
    DateTime CreatedAt
);
