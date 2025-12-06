namespace CommunityCar.Application.Common.Helpers;

/// <summary>
/// Helper class for generating URL-friendly slugs
/// </summary>
public static class SlugHelper
{
    /// <summary>
    /// Generates a URL-friendly slug from a title
    /// /// </summary>
    /// <param name="title">The title to convert to a slug</param>
    /// <param name="includeGuid">Whether to append a GUID for uniqueness</param>
    /// <returns>A URL-friendly slug</returns>
    public static string GenerateSlug(string title, bool includeGuid = true)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title cannot be null or empty", nameof(title));

        var slug = title.ToLower()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "")
            .Replace("&", "and")
            .Replace("@", "at")
            .Replace("#", "")
            .Replace("$", "")
            .Replace("%", "")
            .Replace("^", "")
            .Replace("*", "")
            .Replace("(", "")
            .Replace(")", "")
            .Replace("+", "")
            .Replace("=", "")
            .Replace("[", "")
            .Replace("]", "")
            .Replace("{", "")
            .Replace("}", "")
            .Replace("|", "")
            .Replace("\\", "")
            .Replace("/", "")
            .Replace(":", "")
            .Replace(";", "")
            .Replace("<", "")
            .Replace(">", "")
            .Replace(",", "")
            .Replace(".", "")
            .Replace("?", "")
            .Replace("!", "");

        // Remove multiple consecutive dashes
        while (slug.Contains("--"))
        {
            slug = slug.Replace("--", "-");
        }

        // Trim dashes from start and end
        slug = slug.Trim('-');

        if (includeGuid)
        {
            slug += "-" + Guid.NewGuid().ToString()[..8];
        }

        return slug;
    }

    /// <summary>
    /// Validates if a string is a valid slug format
    /// </summary>
    public static bool IsValidSlug(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
            return false;

        // Slug should only contain lowercase letters, numbers, and hyphens
        return slug.All(c => char.IsLower(c) || char.IsDigit(c) || c == '-');
    }
}
