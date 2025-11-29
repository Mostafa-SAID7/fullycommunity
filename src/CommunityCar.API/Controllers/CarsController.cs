using CommunityCar.Application.DTOs;
using CommunityCar.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CommunityCar.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly ICarService _carService;

    public CarsController(ICarService carService)
    {
        _carService = carService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CarDto>>> GetAll()
    {
        var cars = await _carService.GetAllCarsAsync();
        return Ok(cars);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CarDto>> GetById(Guid id)
    {
        var car = await _carService.GetCarByIdAsync(id);
        return car is null ? NotFound() : Ok(car);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CarDto>> Create(CreateCarDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var car = await _carService.CreateCarAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = car.Id }, car);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<CarDto>> Update(Guid id, UpdateCarDto dto)
    {
        var car = await _carService.UpdateCarAsync(id, dto);
        return car is null ? NotFound() : Ok(car);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _carService.DeleteCarAsync(id);
        return result ? NoContent() : NotFound();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<CarDto>>> Search(
        [FromQuery] string? location,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var cars = await _carService.SearchCarsAsync(location, startDate, endDate);
        return Ok(cars);
    }
}
