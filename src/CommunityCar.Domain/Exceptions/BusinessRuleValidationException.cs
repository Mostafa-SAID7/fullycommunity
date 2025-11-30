namespace CommunityCar.Domain.Exceptions;

public class BusinessRuleValidationException : DomainException
{
    public string RuleName { get; }
    public string Details { get; }

    public BusinessRuleValidationException(string ruleName, string details)
        : base($"Business rule '{ruleName}' was violated: {details}")
    {
        RuleName = ruleName;
        Details = details;
    }

    public BusinessRuleValidationException(IBusinessRule rule)
        : base($"Business rule '{rule.GetType().Name}' was violated: {rule.Message}")
    {
        RuleName = rule.GetType().Name;
        Details = rule.Message;
    }
}

public interface IBusinessRule
{
    bool IsBroken();
    string Message { get; }
}
