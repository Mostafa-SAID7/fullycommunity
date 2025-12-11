using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CommunityCar.Application.Common.Interfaces.Services;

using System.Security.Claims;

namespace CommunityCar.API.Controllers.Services;

[ApiController]
[Route("api/services/registration")]
[Authorize]
[ApiExplorerSettings(GroupName = "services")]
public class RegistrationController : ControllerBase
{
    private readonly IRegistrationService _registrationService;

    public RegistrationController(IRegistrationService registrationService)
    {
        _registrationService = registrationService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Services
    [HttpGet("services")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchServices([FromQuery] RegistrationServiceSearchRequest request, CancellationToken ct)
    {
        var result = await _registrationService.SearchServicesAsync(request, ct);
        return Ok(result);
    }

    [HttpGet("services/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetService(Guid id, CancellationToken ct)
    {
        var service = await _registrationService.GetServiceByIdAsync(id, ct);
        return service is null ? NotFound() : Ok(service);
    }

    [HttpGet("services/{serviceId:guid}/fees")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFees(Guid serviceId, CancellationToken ct)
    {
        var fees = await _registrationService.GetFeesAsync(serviceId, ct);
        return Ok(fees);
    }

    // Requests
    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest([FromBody] CreateRegistrationRequestRequest request, CancellationToken ct)
    {
        var regRequest = await _registrationService.CreateRequestAsync(GetUserId(), request, ct);
        return CreatedAtAction(nameof(GetRequest), new { id = regRequest.Id }, regRequest);
    }

    [HttpGet("requests/{id:guid}")]
    public async Task<IActionResult> GetRequest(Guid id, CancellationToken ct)
    {
        var request = await _registrationService.GetRequestByIdAsync(id, ct);
        return request is null ? NotFound() : Ok(request);
    }

    [HttpGet("requests/my")]
    public async Task<IActionResult> GetMyRequests([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _registrationService.GetCustomerRequestsAsync(GetUserId(), page, pageSize, ct);
        return Ok(result);
    }

    [HttpPost("requests/{id:guid}/submit")]
    public async Task<IActionResult> SubmitRequest(Guid id, CancellationToken ct)
    {
        await _registrationService.SubmitRequestAsync(id, ct);
        return NoContent();
    }

    // Documents
    [HttpGet("documents/required/{type}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRequiredDocuments(Domain.Entities.Services.Registration.RegistrationType type, CancellationToken ct)
    {
        var documents = await _registrationService.GetRequiredDocumentsAsync(type, ct);
        return Ok(documents);
    }

    [HttpGet("requests/{requestId:guid}/documents")]
    public async Task<IActionResult> GetRequestDocuments(Guid requestId, CancellationToken ct)
    {
        var documents = await _registrationService.GetRequestDocumentsAsync(requestId, ct);
        return Ok(documents);
    }

    [HttpPost("documents")]
    public async Task<IActionResult> UploadDocument([FromBody] UploadDocumentRequest request, CancellationToken ct)
    {
        var document = await _registrationService.UploadDocumentAsync(request, ct);
        return Ok(document);
    }

    // Reminders
    [HttpGet("reminders")]
    public async Task<IActionResult> GetMyReminders(CancellationToken ct)
    {
        var reminders = await _registrationService.GetUserRemindersAsync(GetUserId(), ct);
        return Ok(reminders);
    }

    [HttpPost("reminders")]
    public async Task<IActionResult> CreateReminder([FromBody] CreateReminderRequest request, CancellationToken ct)
    {
        var reminder = await _registrationService.CreateReminderAsync(GetUserId(), request, ct);
        return Ok(reminder);
    }

    [HttpDelete("reminders/{id:guid}")]
    public async Task<IActionResult> DeleteReminder(Guid id, CancellationToken ct)
    {
        await _registrationService.DeleteReminderAsync(id, ct);
        return NoContent();
    }
}
