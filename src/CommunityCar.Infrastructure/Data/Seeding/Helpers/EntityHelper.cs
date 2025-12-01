using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Data.Seeding.Helpers;

/// <summary>
/// Helper methods for entity operations during seeding
/// </summary>
public static class EntityHelper
{
    /// <summary>
    /// Safely get or create an entity set
    /// </summary>
    public static DbSet<T> GetEntitySet<T>(AppDbContext context) where T : class
    {
        try
        {
            return context.Set<T>();
        }
        catch (InvalidOperationException)
        {
            // Entity not configured in DbContext
            throw new InvalidOperationException($"Entity {typeof(T).Name} is not configured in DbContext. Please add it to AppDbContext.");
        }
    }

    /// <summary>
    /// /// Check if an entity exists by predicate
    /// </summary>
    public static async Task<bool> ExistsAsync<T>(AppDbContext context, System.Linq.Expressions.Expression<Func<T, bool>> predicate) where T : class
    {
        try
        {
            return await context.Set<T>().AnyAsync(predicate);
        }
        catch (InvalidOperationException)
        {
            // Entity not configured, assume it doesn't exist
            return false;
        }
    }

    /// <summary>
    /// Safely add entity if it doesn't exist
    /// </summary>
    public static async Task<bool> AddIfNotExistsAsync<T>(
        AppDbContext context,
        T entity,
        System.Linq.Expressions.Expression<Func<T, bool>> existsPredicate) where T : class
    {
        try
        {
            if (!await context.Set<T>().AnyAsync(existsPredicate))
            {
                context.Set<T>().Add(entity);
                return true;
            }
            return false;
        }
        catch (InvalidOperationException)
        {
            // Entity not configured, skip
            return false;
        }
    }

    /// <summary>
    /// Get random items from a collection
    /// </summary>
    public static IEnumerable<T> GetRandomItems<T>(IEnumerable<T> source, int count)
    {
        var items = source.ToList();
        var random = new Random();

        return items.OrderBy(x => random.Next()).Take(Math.Min(count, items.Count));
    }

    /// <summary>
    /// Generate random date within range
    /// </summary>
    public static DateTime GetRandomDate(DateTime start, DateTime end)
    {
        var range = end - start;
        var randomDays = Random.Shared.Next(0, range.Days + 1);
        return start.AddDays(randomDays);
    }
    /// <summary>
    /// Generate random date in the past
    /// </summary>
    public static DateTime GetRandomPastDate(int maxDaysAgo = 365)
    {
        return DateTime.UtcNow.AddDays(-Random.Shared.Next(1, maxDaysAgo + 1));
    }
}