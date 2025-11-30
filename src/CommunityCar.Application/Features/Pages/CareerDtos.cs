using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Features.Pages;

public record CareerPositionDto(
    Guid Id,
    string Title,
    string Slug,
    string Department,
    string Location,
    EmploymentType EmploymentType,
    WorkplaceType WorkplaceType,
    ExperienceLevel ExperienceLevel,
    string Description,
    string? Requirements,
    string? Responsibilities,
    string? Benefits,
    string? SalaryRange,
    List<string> Skills,
    List<string> Tags,
    bool IsFeatured,
    bool IsUrgent,
    DateTime? ApplicationDeadline,
    string? ApplicationUrl,
    int ViewCount,
    int ApplicationCount,
    DateTime CreatedAt
);

public record CareerPositionListItemDto(
    Guid Id,
    string Title,
    string Slug,
    string Department,
    string Location,
    EmploymentType EmploymentType,
    WorkplaceType WorkplaceType,
    ExperienceLevel ExperienceLevel,
    string? SalaryRange,
    bool IsFeatured,
    bool IsUrgent,
    DateTime? ApplicationDeadline,
    DateTime CreatedAt
);

public record CareerApplicationDto(
    Guid Id,
    Guid PositionId,
    string PositionTitle,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? LinkedInUrl,
    string? ResumeUrl,
    string? CoverLetter,
    string? CurrentCompany,
    string? CurrentTitle,
    int? YearsOfExperience,
    ApplicationStatus Status,
    string? ReviewedByName,
    DateTime? ReviewedAt,
    string? ReviewNotes,
    int? Rating,
    DateTime CreatedAt
);

public record CareerApplicationListItemDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? CurrentTitle,
    int? YearsOfExperience,
    ApplicationStatus Status,
    int? Rating,
    DateTime CreatedAt
);

public record CareerSearchRequest(
    string? Query,
    string? Department,
    string? Location,
    EmploymentType? EmploymentType,
    WorkplaceType? WorkplaceType,
    ExperienceLevel? ExperienceLevel,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record ApplicationSearchRequest(
    string? Query,
    ApplicationStatus? Status,
    int? MinRating,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateCareerPositionRequest(
    string Title,
    string Department,
    string Location,
    EmploymentType EmploymentType,
    WorkplaceType WorkplaceType,
    ExperienceLevel ExperienceLevel,
    string Description,
    string? Requirements,
    string? Responsibilities,
    string? Benefits,
    string? SalaryRange,
    string? Currency,
    List<string>? Skills,
    List<string>? Tags,
    bool IsFeatured,
    bool IsUrgent,
    DateTime? ApplicationDeadline,
    string? ApplicationUrl,
    string? ApplicationEmail
);

public record UpdateCareerPositionRequest(
    string? Title,
    string? Department,
    string? Location,
    EmploymentType? EmploymentType,
    WorkplaceType? WorkplaceType,
    ExperienceLevel? ExperienceLevel,
    string? Description,
    string? Requirements,
    string? Responsibilities,
    string? Benefits,
    string? SalaryRange,
    List<string>? Skills,
    List<string>? Tags,
    bool? IsFeatured,
    bool? IsUrgent,
    DateTime? ApplicationDeadline
);

public record CreateApplicationRequest(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? LinkedInUrl,
    string? PortfolioUrl,
    string? GitHubUrl,
    string? ResumeUrl,
    string? CoverLetter,
    string? CurrentCompany,
    string? CurrentTitle,
    int? YearsOfExperience,
    string? ExpectedSalary,
    string? NoticePeriod,
    DateTime? AvailableFrom,
    string? HowDidYouHear,
    string? AdditionalInfo
);
