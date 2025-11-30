namespace CommunityCar.API.Models.Responses;

public class ErrorResponse
{
    public int Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? RequestId { get; set; }
    public IDictionary<string, string[]>? Errors { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public static ErrorResponse Create(int status, string message, string? requestId = null) => new()
    {
        Status = status,
        Message = message,
        RequestId = requestId
    };

    public static ErrorResponse ValidationError(IDictionary<string, string[]> errors, string? requestId = null) => new()
    {
        Status = 400,
        Message = "Validation failed",
        Errors = errors,
        RequestId = requestId
    };
}
