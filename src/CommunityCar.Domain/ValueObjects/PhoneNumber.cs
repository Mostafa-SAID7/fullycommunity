using System.Text.RegularExpressions;
using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.ValueObjects;

public partial class PhoneNumber : ValueObject
{
    public string CountryCode { get; private set; }
    public string Number { get; private set; }

    private PhoneNumber()
    {
        CountryCode = string.Empty;
        Number = string.Empty;
    }

    public PhoneNumber(string countryCode, string number)
    {
        if (string.IsNullOrWhiteSpace(countryCode))
            throw new ArgumentException("Country code is required", nameof(countryCode));

        if (string.IsNullOrWhiteSpace(number))
            throw new ArgumentException("Phone number is required", nameof(number));

        var cleanNumber = PhoneRegex().Replace(number, "");

        if (cleanNumber.Length < 7 || cleanNumber.Length > 15)
            throw new ArgumentException("Invalid phone number length", nameof(number));

        CountryCode = countryCode.StartsWith('+') ? countryCode : $"+{countryCode}";
        Number = cleanNumber;
    }

    public static PhoneNumber? TryCreate(string? fullNumber)
    {
        if (string.IsNullOrWhiteSpace(fullNumber))
            return null;

        try
        {
            var match = FullPhoneRegex().Match(fullNumber);
            if (match.Success)
            {
                return new PhoneNumber(match.Groups[1].Value, match.Groups[2].Value);
            }
            return null;
        }
        catch
        {
            return null;
        }
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return CountryCode;
        yield return Number;
    }

    public override string ToString() => $"{CountryCode} {Number}";

    [GeneratedRegex(@"[^\d]")]
    private static partial Regex PhoneRegex();

    [GeneratedRegex(@"^\+?(\d{1,3})[\s-]?(.+)$")]
    private static partial Regex FullPhoneRegex();
}
