using CommunityCar.Application.Common.Pagination;
using CommunityCar.Application.Features.Services.FuelCharging;

namespace CommunityCar.Application.Common.Interfaces.Services;

public interface IFuelChargingService
{
    // Fuel Stations
    Task<FuelStationDto?> GetFuelStationByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<FuelStationDto>> SearchFuelStationsAsync(FuelStationSearchRequest request, CancellationToken ct = default);
    Task UpdateFuelPricesAsync(Guid stationId, UpdateFuelPricesRequest request, CancellationToken ct = default);
    
    // Charging Stations
    Task<ChargingStationDto?> GetChargingStationByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedResult<ChargingStationDto>> SearchChargingStationsAsync(ChargingStationSearchRequest request, CancellationToken ct = default);
    Task<List<ChargerDto>> GetAvailableChargersAsync(Guid stationId, CancellationToken ct = default);
    
    // Charging Sessions
    Task<ChargingSessionDto?> GetSessionByIdAsync(Guid id, CancellationToken ct = default);
    Task<ChargingSessionDto?> GetActiveSessionAsync(Guid customerId, CancellationToken ct = default);
    Task<PagedResult<ChargingSessionDto>> GetCustomerSessionsAsync(Guid customerId, int page, int pageSize, CancellationToken ct = default);
    Task<ChargingSessionDto> StartChargingSessionAsync(Guid customerId, StartChargingSessionRequest request, CancellationToken ct = default);
    Task<ChargingSessionDto> StopChargingSessionAsync(Guid sessionId, StopChargingSessionRequest request, CancellationToken ct = default);
    
    // Route Planning
    Task<RoutePlanDto> PlanRouteAsync(RoutePlannerRequest request, CancellationToken ct = default);
    
    // Rewards
    Task<int> GetRewardPointsAsync(Guid customerId, CancellationToken ct = default);
}
