namespace CommunityCar.Application.DTOs.Requests.Services.Expert;

public record CreateConsultationRequest(
    Guid ExpertId,
    string Topic,
    DateTime PreferredDate,
    string? Description
);

public record ExpertSearchRequest(
    string? SearchTerm,
    List<string>? Specializations,
    decimal? MinRating,
    decimal? MaxHourlyRate,
    bool? AvailableNow,
    string? SortBy,
    int Page = 1,
    int PageSize = 20
);

public record CreateExpertProfileRequest(
    string Bio,
    List<string> Specializations,
    decimal HourlyRate,
    int YearsOfExperience,
    List<string>? Certifications,
    string? Availability
);

public record AITriageRequest(
    string ProblemDescription,
    string? VehicleMake,
    string? VehicleModel,
    int? VehicleYear,
    List<string>? Symptoms,
    List<string>? ErrorCodes
);

public record UpdateConsultationRequest(
    string? Summary,
    string? Resolution,
    string? Notes,
    List<string>? Recommendations
);

