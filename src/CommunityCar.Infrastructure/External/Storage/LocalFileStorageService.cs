using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.External.Storage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _basePath;
    private readonly string _baseUrl;
    private readonly ILogger<LocalFileStorageService> _logger;

    public LocalFileStorageService(string basePath, string baseUrl, ILogger<LocalFileStorageService> logger)
    {
        _basePath = basePath;
        _baseUrl = baseUrl;
        _logger = logger;

        if (!Directory.Exists(_basePath))
            Directory.CreateDirectory(_basePath);
    }

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null)
    {
        var uniqueFileName = $"{Guid.NewGuid():N}_{fileName}";
        var folderPath = string.IsNullOrEmpty(folder) ? _basePath : Path.Combine(_basePath, folder);

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        var filePath = Path.Combine(folderPath, uniqueFileName);

        await using var fileStream = new FileStream(filePath, FileMode.Create);
        await stream.CopyToAsync(fileStream);

        var relativePath = string.IsNullOrEmpty(folder) ? uniqueFileName : $"{folder}/{uniqueFileName}";
        return $"{_baseUrl}/{relativePath}";
    }

    public Task<Stream?> DownloadAsync(string fileUrl)
    {
        var relativePath = fileUrl.Replace(_baseUrl, "").TrimStart('/');
        var filePath = Path.Combine(_basePath, relativePath);

        if (!File.Exists(filePath))
            return Task.FromResult<Stream?>(null);

        return Task.FromResult<Stream?>(new FileStream(filePath, FileMode.Open, FileAccess.Read));
    }

    public Task<bool> DeleteAsync(string fileUrl)
    {
        try
        {
            var relativePath = fileUrl.Replace(_baseUrl, "").TrimStart('/');
            var filePath = Path.Combine(_basePath, relativePath);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileUrl}", fileUrl);
            return Task.FromResult(false);
        }
    }

    public Task<string> GetSignedUrlAsync(string fileUrl, TimeSpan expiration)
    {
        // Local storage doesn't support signed URLs
        return Task.FromResult(fileUrl);
    }
}
