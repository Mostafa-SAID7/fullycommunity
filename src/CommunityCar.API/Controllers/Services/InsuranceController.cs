using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;
using CommunityCar.Application.DTOs.Requests.Services.Insurance;
using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/insurance")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class InsuranceController : ControllerBase
{
    private readonly IInsuranceService _insuranceService;

    public InsuranceController(IInsuranceService insuranceService)
    {
        _insuranceService = insuranceService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Providers
    [HttpGet("providers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviders(CancellationToken ct)
    {
        var providers = await _insuranceService.GetAllProvidersAsync(ct);
        return Ok(providers);
    }

    [HttpGet("providers/featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeaturedProviders(CancellationToken ct)
    {
        var providers = await _insuranceService.GetFeaturedProvidersAsync(ct);
        return Ok(providers);
    }

    // Quotes
    [HttpPost("quotes")]
    public async Task<IActionResult> GetQuotes([FromBody] GetInsuranceQuotesRequest request, CancellationToken ct)
    {
        var quotes = await _insuranceService.GetQuotesAsync(request, ct);
        return Ok(quotes);
    }

    [HttpPost("quotes/compare")]
    public async Task<IActionResult> CompareQuotes([FromBody] CompareQuotesRequest request, CancellationToken ct)
    {
        var comparison = await _insuranceService.CompareQuotesAsync(request, ct);
        return Ok(comparison);
    }

    [HttpPost("quotes/accept")]
    public async Task<IActionResult> AcceptQuote([FromBody] AcceptInsuranceQuoteRequest request, CancellationToken ct)
    {
        var policy = await _insuranceService.AcceptQuoteAsync(GetUserId(), request, ct);
        return Ok(policy);
    }

    // Policies
    [HttpGet("policies")]
    public async Task<IActionResult> GetMyPolicies(CancellationToken ct)
    {
        var policies = await _insuranceService.GetCustomerPoliciesAsync(GetUserId(), ct);
        return Ok(policies);
    }

    [HttpGet("policies/{id:guid}")]
    public async Task<IActionResult> GetPolicy(Guid id, CancellationToken ct)
    {
        var policy = await _insuranceService.GetPolicyByIdAsync(id, ct);
        return policy is null ? NotFound() : Ok(policy);
    }

    [HttpPost("policies/{id:guid}/renew")]
    public async Task<IActionResult> RenewPolicy(Guid id, CancellationToken ct)
    {
        var policy = await _insuranceService.RenewPolicyAsync(id, ct);
        return Ok(policy);
    }

    // Claims
    [HttpPost("claims")]
    public async Task<IActionResult> CreateClaim([FromBody] CreateInsuranceClaimRequest request, CancellationToken ct)
    {
        var claim = await _insuranceService.CreateClaimAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetClaim), new { id = claim.Id }, claim);
    }

    [HttpGet("claims/{id:guid}")]
    public async Task<IActionResult> GetClaim(Guid id, CancellationToken ct)
    {
        var claim = await _insuranceService.GetClaimByIdAsync(id, ct);
        return claim is null ? NotFound() : Ok(claim);
    }

    [HttpGet("policies/{policyId:guid}/claims")]
    public async Task<IActionResult> GetPolicyClaims(Guid policyId, CancellationToken ct)
    {
        var claims = await _insuranceService.GetPolicyClaimsAsync(policyId, ct);
        return Ok(claims);
    }
}
