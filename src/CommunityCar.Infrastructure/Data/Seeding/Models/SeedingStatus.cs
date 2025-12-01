namespace CommunityCar.Infrastructure.Data.Seeding.Models;

/// <summary>
/// Tracks seeding operation status and results
/// </summary>
public class SeedingStatus
{
    public string SeederName { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public TimeSpan Duration => EndTime?.Subtract(StartTime) ?? TimeSpan.Zero;
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public int ItemsSeeded { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();

    public void MarkSuccess(int itemsSeeded = 0)
    {
        EndTime = DateTime.UtcNow;
        IsSuccess = true;
        ItemsSeeded = itemsSeeded;
    }

    public void MarkFailure(string errorMessage)
    {
        EndTime = DateTime.UtcNow;
        IsSuccess = false;
        ErrorMessage = errorMessage;
    }

    public void AddMetadata(string key, object value)
    {
        Metadata[key] = value;
    }
}

/// <summary>
/// Overall seeding operation results
/// </summary>
public class SeedingResults
{
    public DateTime StartTime { get; set; } = DateTime.UtcNow;
    public DateTime? EndTime { get; set; }
    public TimeSpan TotalDuration => EndTime?.Subtract(StartTime) ?? TimeSpan.Zero;
    public List<SeedingStatus> SeederResults { get; set; } = new();
    public bool IsSuccess => SeederResults.All(r => r.IsSuccess);
    public int TotalItemsSeeded => SeederResults.Sum(r => r.ItemsSeeded);
    public string Environment { get; set; } = string.Empty;
    public bool IsProductionMode { get; set; }

    public void Complete()
    {
        EndTime = DateTime.UtcNow;
    }

    public SeedingStatus AddSeederResult(string seederName)
    {
        var status = new SeedingStatus
        {
            SeederName = seederName,
            StartTime = DateTime.UtcNow
        };
        SeederResults.Add(status);
        return status;
    }

    public string GetSummary()
    {
        var successful = SeederResults.Count(r => r.IsSuccess);
        var failed = SeederResults.Count(r => !r.IsSuccess);
        
        return $"Seeding completed in {TotalDuration.TotalSeconds:F1}s. " +
               $"Success: {successful}, Failed: {failed}, Total Items: {TotalItemsSeeded}";
    }
}