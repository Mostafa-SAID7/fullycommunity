using CommunityCar.Application.DTOs;

namespace CommunityCar.Application.Interfaces;

public interface ICarService
{
    Task<IEnumerable<CarDto>> GetAllCarsAsync();
    Task<CarDto?> GetCarByIdAsync(Guid id);
    Task<CarDto> CreateCarAsync(CreateCarDto dto, Guid ownerId);
    Task<CarDto?> UpdateCarAsync(Guid id, UpdateCarDto dto);
    Task<bool> DeleteCarAsync(Guid id);
    Task<IEnumerable<CarDto>> SearchCarsAsync(string? location, DateTime? startDate, DateTime? endDate);
}
