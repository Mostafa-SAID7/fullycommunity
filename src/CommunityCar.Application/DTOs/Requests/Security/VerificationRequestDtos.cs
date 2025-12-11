namespace CommunityCar.Application.DTOs.Requests.Security;

public record SendOtpRequest(
    string PhoneNumber
);

public record VerifyOtpRequest(
    string PhoneNumber,
    string Code
);

public record Verify2FaRequest(
    string Code
);
