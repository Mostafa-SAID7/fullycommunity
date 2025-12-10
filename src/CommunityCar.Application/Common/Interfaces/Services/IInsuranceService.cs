using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.DTOs.Requests.Services.Insurance;
using CommunityCar.Application.DTOs.Response.Services.Insurance;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IInsuranceService
{
    // Providers
    Task<InsuranceProviderDto?> GetProviderByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<InsuranceProviderDto>> GetAllProvidersAsync(CancellationToken ct = default);
    Task<List<InsuranceProviderDto>> GetFeaturedProvidersAsync(CancellationToken ct = default);
    
    // Quotes
    Task<List<InsuranceQuoteDto>> GetQuotesAsync(GetInsuranceQuotesRequest request, CancellationToken ct = default);
    Task<InsuranceQuoteDto?> GetQuoteByIdAsync(Guid id, CancellationToken ct = default);
    Task<QuoteComparisonDto> CompareQuotesAsync(CompareQuotesRequest request, CancellationToken ct = default);
    
    // Policies
    Task<InsurancePolicyDto?> GetPolicyByIdAsync(Guid id, CancellationToken ct = default);
    Task<InsurancePolicyDto?> GetPolicyByNumberAsync(string policyNumber, CancellationToken ct = default);
    Task<List<InsurancePolicyDto>> GetCustomerPoliciesAsync(Guid customerId, CancellationToken ct = default);
    Task<InsurancePolicyDto> AcceptQuoteAsync(Guid customerId, AcceptInsuranceQuoteRequest request, CancellationToken ct = default);
    Task<InsurancePolicyDto> RenewPolicyAsync(Guid policyId, CancellationToken ct = default);
    Task CancelPolicyAsync(Guid policyId, string reason, CancellationToken ct = default);
    
    // Claims
    Task<InsuranceClaimDto?> GetClaimByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<InsuranceClaimDto>> GetPolicyClaimsAsync(Guid policyId, CancellationToken ct = default);
    Task<InsuranceClaimDto> CreateClaimAsync(Guid customerId, CreateInsuranceClaimRequest request, CancellationToken ct = default);
    Task<InsuranceClaimDto> UpdateClaimStatusAsync(Guid id, UpdateClaimStatusRequest request, CancellationToken ct = default);
    Task AddClaimDocumentAsync(Guid claimId, string documentUrl, CancellationToken ct = default);
}
