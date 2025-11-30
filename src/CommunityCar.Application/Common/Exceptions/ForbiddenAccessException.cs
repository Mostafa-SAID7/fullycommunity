namespace CommunityCar.Application.Common.Exceptions;

public class ForbiddenAccessException : Exception
{
    public ForbiddenAccessException() : base("Access denied.") { }

    public ForbiddenAccessException(string message) : base(message) { }
}
