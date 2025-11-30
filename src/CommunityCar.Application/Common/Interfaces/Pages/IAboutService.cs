using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Pages;
using CommunityCar.Domain.Entities.Pages;

namespace CommunityCar.Application.Common.Interfaces.Pages;

public interface IAboutService
{
    // Team Members
    Task<TeamMemberDto?> GetTeamMemberByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<TeamMemberDto>> GetTeamMembersAsync(bool leadershipOnly = false, CancellationToken ct = default);
    Task<List<string>> GetDepartmentsAsync(CancellationToken ct = default);
    Task<TeamMemberDto> CreateTeamMemberAsync(CreateTeamMemberRequest request, CancellationToken ct = default);
    Task<TeamMemberDto> UpdateTeamMemberAsync(Guid id, UpdateTeamMemberRequest request, CancellationToken ct = default);
    Task DeleteTeamMemberAsync(Guid id, CancellationToken ct = default);
    
    // Testimonials
    Task<TestimonialDto?> GetTestimonialByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<TestimonialDto>> GetTestimonialsAsync(int page, int pageSize, CancellationToken ct = default);
    Task<List<TestimonialDto>> GetFeaturedTestimonialsAsync(int count = 5, CancellationToken ct = default);
    Task<TestimonialDto> CreateTestimonialAsync(CreateTestimonialRequest request, CancellationToken ct = default);
    Task<TestimonialDto> UpdateTestimonialAsync(Guid id, UpdateTestimonialRequest request, CancellationToken ct = default);
    Task DeleteTestimonialAsync(Guid id, CancellationToken ct = default);
    
    // Partners
    Task<PartnerDto?> GetPartnerByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<PartnerDto>> GetPartnersAsync(PartnerType? type = null, CancellationToken ct = default);
    Task<List<PartnerDto>> GetFeaturedPartnersAsync(int count = 10, CancellationToken ct = default);
    Task<PartnerDto> CreatePartnerAsync(CreatePartnerRequest request, CancellationToken ct = default);
    Task<PartnerDto> UpdatePartnerAsync(Guid id, UpdatePartnerRequest request, CancellationToken ct = default);
    Task DeletePartnerAsync(Guid id, CancellationToken ct = default);
}
