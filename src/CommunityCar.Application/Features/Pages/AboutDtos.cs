using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Features.Pages;

// Team Member DTOs
public record TeamMemberDto(
    Guid Id,
    string Name,
    string? Title,
    string? Department,
    string? Bio,
    string? PhotoUrl,
    string? LinkedInUrl,
    string? TwitterUrl,
    string? GitHubUrl,
    string? Email,
    int SortOrder,
    bool IsFeatured,
    bool IsLeadership
);

public record CreateTeamMemberRequest(
    string Name,
    string? Title,
    string? Department,
    string? Bio,
    string? PhotoUrl,
    string? LinkedInUrl,
    string? TwitterUrl,
    string? GitHubUrl,
    string? Email,
    int SortOrder,
    bool IsFeatured,
    bool IsLeadership
);

public record UpdateTeamMemberRequest(
    string? Name,
    string? Title,
    string? Department,
    string? Bio,
    string? PhotoUrl,
    string? LinkedInUrl,
    string? TwitterUrl,
    string? GitHubUrl,
    string? Email,
    int? SortOrder,
    bool? IsPublished,
    bool? IsFeatured,
    bool? IsLeadership
);

// Testimonial DTOs
public record TestimonialDto(
    Guid Id,
    string AuthorName,
    string? AuthorTitle,
    string? AuthorCompany,
    string? AuthorPhotoUrl,
    string Content,
    int Rating,
    string? VideoUrl,
    string? Source,
    bool IsFeatured,
    bool IsVerified,
    DateTime CreatedAt
);

public record CreateTestimonialRequest(
    string AuthorName,
    string? AuthorTitle,
    string? AuthorCompany,
    string? AuthorPhotoUrl,
    Guid? UserId,
    string Content,
    int Rating,
    string? VideoUrl,
    string? SourceUrl,
    string? Source,
    bool IsFeatured
);

public record UpdateTestimonialRequest(
    string? AuthorName,
    string? AuthorTitle,
    string? AuthorCompany,
    string? AuthorPhotoUrl,
    string? Content,
    int? Rating,
    string? VideoUrl,
    bool? IsPublished,
    bool? IsFeatured,
    bool? IsVerified
);

// Partner DTOs
public record PartnerDto(
    Guid Id,
    string Name,
    string? Description,
    string? LogoUrl,
    string? WebsiteUrl,
    PartnerType Type,
    PartnerTier Tier,
    int SortOrder,
    bool IsFeatured,
    DateTime? PartnershipStartDate
);

public record CreatePartnerRequest(
    string Name,
    string? Description,
    string? LogoUrl,
    string? WebsiteUrl,
    PartnerType Type,
    PartnerTier Tier,
    int SortOrder,
    bool IsFeatured,
    DateTime? PartnershipStartDate,
    DateTime? PartnershipEndDate
);

public record UpdatePartnerRequest(
    string? Name,
    string? Description,
    string? LogoUrl,
    string? WebsiteUrl,
    PartnerType? Type,
    PartnerTier? Tier,
    int? SortOrder,
    bool? IsPublished,
    bool? IsFeatured,
    DateTime? PartnershipEndDate
);
