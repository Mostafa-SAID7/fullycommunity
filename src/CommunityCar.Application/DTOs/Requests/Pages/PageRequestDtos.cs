using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.DTOs.Requests.Pages;

public record CreateFAQRequest(
    string Question,
    string Answer,
    FAQCategory Category,
    List<string>? Tags,
    int? SortOrder,
    bool? IsFeatured,
    string? MetaTitle,
    string? MetaDescription
);

public record UpdateFAQRequest(
    string? Question,
    string? Answer,
    FAQCategory? Category,
    List<string>? Tags,
    int? SortOrder,
    bool? IsPublished,
    bool? IsFeatured,
    string? MetaTitle,
    string? MetaDescription
);

public record FAQSearchRequest(
    string? SearchTerm,
    FAQCategory? Category,
    bool? IsPublished,
    bool? IsFeatured,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateLegalDocumentRequest(
    string Title,
    string Slug,
    LegalDocumentType Type,
    string Content,
    string? Summary,
    string Version,
    DateTime EffectiveDate,
    DateTime? ExpiresAt,
    bool RequiresAcceptance,
    string? MetaTitle,
    string? MetaDescription
);

public record UpdateLegalDocumentRequest(
    string? Title,
    string? Slug,
    string? Content,
    string? Summary,
    string? Version,
    DateTime? EffectiveDate,
    DateTime? ExpiresAt,
    bool? RequiresAcceptance,
    string? MetaTitle,
    string? MetaDescription,
    string? ChangeLog
);

// Career Request DTOs
public record CreateCareerPositionRequest(
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
    bool? IsFeatured,
    DateTime? Deadline,
    string? MetaTitle,
    string? MetaDescription
);

public record UpdateCareerPositionRequest(
    string? Title,
    string? Slug,
    string? Department,
    string? Location,
    string? EmploymentType,
    string? ExperienceLevel,
    string? Description,
    string? Requirements,
    string? Benefits,
    decimal? SalaryMin,
    decimal? SalaryMax,
    string? SalaryCurrency,
    bool? IsRemote,
    bool? IsPublished,
    bool? IsFeatured,
    DateTime? Deadline,
    string? MetaTitle,
    string? MetaDescription
);

public record CareerSearchRequest(
    string? SearchTerm,
    string? Department,
    string? Location,
    string? EmploymentType,
    string? ExperienceLevel,
    bool? IsRemote,
    bool? IsPublished,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record ApplicationSearchRequest(
    ApplicationStatus? Status,
    int? MinRating,
    DateTime? FromDate,
    DateTime? ToDate,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateApplicationRequest(
    string FullName,
    string Email,
    string Phone,
    string? ResumeUrl,
    string? CoverLetter,
    string? LinkedInUrl,
    string? PortfolioUrl
);

// Contact Request DTOs
public record CreateContactRequest(
    string Name,
    string Email,
    string? Phone,
    string Subject,
    string Message,
    ContactType Type
);

public record ContactSearchRequest(
    string? SearchTerm,
    ContactType? Type,
    ContactStatus? Status,
    Guid? AssignedToId,
    DateTime? FromDate,
    DateTime? ToDate,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

// About Request DTOs - Team
public record CreateTeamMemberRequest(
    string Name,
    string Title,
    string Department,
    string? Bio,
    string? PhotoUrl,
    string? Email,
    string? LinkedInUrl,
    string? TwitterUrl,
    bool? IsLeadership,
    int? SortOrder
);

public record UpdateTeamMemberRequest(
    string? Name,
    string? Title,
    string? Department,
    string? Bio,
    string? PhotoUrl,
    string? Email,
    string? LinkedInUrl,
    string? TwitterUrl,
    bool? IsLeadership,
    bool? IsPublished,
    int? SortOrder
);

// About Request DTOs - Testimonials
public record CreateTestimonialRequest(
    string AuthorName,
    string? AuthorTitle,
    string? AuthorCompany,
    string? AuthorPhotoUrl,
    string Content,
    int? Rating,
    bool? IsFeatured
);

public record UpdateTestimonialRequest(
    string? AuthorName,
    string? AuthorTitle,
    string? AuthorCompany,
    string? AuthorPhotoUrl,
    string? Content,
    int? Rating,
    bool? IsFeatured,
    bool? IsPublished
);

// About Request DTOs - Partners
public record CreatePartnerRequest(
    string Name,
    string? Description,
    string? LogoUrl,
    string? WebsiteUrl,
    PartnerType Type,
    bool? IsFeatured,
    int? SortOrder
);

public record UpdatePartnerRequest(
    string? Name,
    string? Description,
    string? LogoUrl,
    string? WebsiteUrl,
    PartnerType? Type,
    bool? IsFeatured,
    bool? IsPublished,
    int? SortOrder
);

// Page Request DTOs
public record CreatePageRequest(
    string Title,
    string Slug,
    string Content,
    string? Summary,
    PageType Type,
    Guid? ParentId,
    bool? ShowInNavigation,
    bool? ShowInFooter,
    int? SortOrder,
    string? FeaturedImageUrl,
    string? MetaTitle,
    string? MetaDescription,
    List<string>? MetaKeywords
);

public record UpdatePageRequest(
    string? Title,
    string? Slug,
    string? Content,
    string? Summary,
    Guid? ParentId,
    bool? ShowInNavigation,
    bool? ShowInFooter,
    int? SortOrder,
    string? FeaturedImageUrl,
    string? MetaTitle,
    string? MetaDescription,
    List<string>? MetaKeywords
);

public record PageSearchRequest(
    string? SearchTerm,
    PageType? Type,
    PageStatus? Status,
    bool? ShowInNavigation,
    bool? ShowInFooter,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateSectionRequest(
    string SectionType,
    string Title,
    string? Content,
    Dictionary<string, object>? Settings,
    int? SortOrder
);

public record UpdateSectionRequest(
    string? SectionType,
    string? Title,
    string? Content,
    Dictionary<string, object>? Settings,
    int? SortOrder,
    bool? IsPublished
);

// Menu Request DTOs
public record CreateMenuItemRequest(
    MenuLocation Location,
    string Label,
    string? Url,
    Guid? PageId,
    Guid? ParentId,
    string Target,
    string? Icon,
    int? SortOrder
);

public record UpdateMenuItemRequest(
    string? Label,
    string? Url,
    Guid? PageId,
    Guid? ParentId,
    string? Target,
    string? Icon,
    int? SortOrder,
    bool? IsPublished
);

// Announcement Request DTOs
public record CreateAnnouncementRequest(
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
    DateTime? StartDate,
    DateTime? EndDate
);

public record UpdateAnnouncementRequest(
    string? Title,
    string? Content,
    string? Type,
    string? BackgroundColor,
    string? TextColor,
    string? LinkUrl,
    string? LinkText,
    List<string>? TargetPages,
    bool? IsGlobal,
    bool? IsDismissible,
    bool? IsActive,
    DateTime? StartDate,
    DateTime? EndDate
);
