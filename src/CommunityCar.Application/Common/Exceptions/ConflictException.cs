namespace CommunityCar.Application.Common.Exceptions;

public class ConflictException : Exception
{
    public ConflictException() : base() { }

    public ConflictException(string message) : base(message) { }

    public ConflictException(string name, object key) : base($"Entity \"{name}\" ({key}) already exists.") { }
}
