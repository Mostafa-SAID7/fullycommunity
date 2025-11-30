namespace CommunityCar.Domain.Exceptions;

public class InvalidEntityStateException : DomainException
{
    public string EntityName { get; }
    public string CurrentState { get; }
    public string ExpectedState { get; }

    public InvalidEntityStateException(string entityName, string currentState, string expectedState)
        : base($"Entity \"{entityName}\" is in invalid state. Current: {currentState}, Expected: {expectedState}")
    {
        EntityName = entityName;
        CurrentState = currentState;
        ExpectedState = expectedState;
    }
}
