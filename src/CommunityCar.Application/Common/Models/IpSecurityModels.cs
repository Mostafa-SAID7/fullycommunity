namespace CommunityCar.Application.Common.Models;

public record IpRiskAssessment(
    string IpAddress,
    int RiskScore,
    string RiskLevel,
    bool IsVpn,
    bool IsProxy,
    bool IsTor,
    bool IsDataCenter,
    bool IsKnownBad,
    int RecentFailedAttempts,
    IEnumerable<string> RiskFactors
);
