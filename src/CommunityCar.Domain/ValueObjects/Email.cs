using System.Text.RegularExpressions;
using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.ValueObjects;

public partial class Email : ValueObject
{
    public string Value { get; private set; }

    private Email()
    {
        Value = string.Empty;
    }

    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Email is required", nameof(value));

        if (!EmailRegex().IsMatch(value))
            throw new ArgumentException("Invalid email format", nameof(value));

        Value = value.ToLowerInvariant();
    }

    public static Email? TryCreate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        try
        {
            return new Email(value);
        }
        catch
        {
            return null;
        }
    }

    public string Domain => Value.Split('@')[1];
    public string LocalPart => Value.Split('@')[0];

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    public static implicit operator string(Email email) => email.Value;

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();
}
