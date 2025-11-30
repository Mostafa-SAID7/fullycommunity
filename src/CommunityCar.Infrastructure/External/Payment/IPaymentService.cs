namespace CommunityCar.Infrastructure.External.Payment;

public interface IPaymentService
{
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
    Task<RefundResult> RefundAsync(string transactionId, decimal amount);
    Task<PaymentStatus> GetPaymentStatusAsync(string transactionId);
    Task<string> CreatePaymentIntentAsync(decimal amount, string currency, Dictionary<string, string>? metadata = null);
}

public record PaymentRequest(
    decimal Amount,
    string Currency,
    string PaymentMethodId,
    string? CustomerId = null,
    string? Description = null,
    Dictionary<string, string>? Metadata = null
);

public record PaymentResult(
    bool Success,
    string TransactionId,
    string? ErrorMessage = null,
    PaymentStatus Status = PaymentStatus.Pending
);

public record RefundResult(
    bool Success,
    string RefundId,
    string? ErrorMessage = null
);

public enum PaymentStatus
{
    Pending,
    Processing,
    Succeeded,
    Failed,
    Cancelled,
    Refunded
}
