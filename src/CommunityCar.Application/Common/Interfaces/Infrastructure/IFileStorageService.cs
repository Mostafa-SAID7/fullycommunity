using CommunityCar.Domain.Entities.Storage;
using Microsoft.AspNetCore.Http;

namespace CommunityCar.Application.Common.Interfaces.Infrastructure;

/// <summary>
/// File storage service for handling uploads and file management
/// </summary>
public interface IFileStorageService
{
    // Upload
    Task<StoredFile> UploadAsync(IFormFile file, FileCategory category, Guid? entityId = null, string? entityType = null, CancellationToken ct = default);
    Task<StoredFile> UploadAsync(Stream stream, string fileName, string contentType, FileCategory category, Guid? entityId = null, string? entityType = null, CancellationToken ct = default);
    Task<StoredFile> UploadFromUrlAsync(string url, FileCategory category, Guid? entityId = null, string? entityType = null, CancellationToken ct = default);
    
    // Batch upload
    Task<List<StoredFile>> UploadMultipleAsync(IEnumerable<IFormFile> files, FileCategory category, Guid? entityId = null, string? entityType = null, CancellationToken ct = default);
    
    // Get
    Task<StoredFile?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<StoredFile>> GetByEntityAsync(string entityType, Guid entityId, CancellationToken ct = default);
    Task<Stream?> GetStreamAsync(Guid id, CancellationToken ct = default);
    
    // Delete
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
    Task<int> DeleteByEntityAsync(string entityType, Guid entityId, CancellationToken ct = default);
    
    // URL generation
    string GetUrl(StoredFile file);
    string GetThumbnailUrl(StoredFile file, int width = 200, int height = 200);
    Task<string> GetSignedUrlAsync(Guid id, TimeSpan expiry, CancellationToken ct = default);
    
    // Image processing
    Task<StoredFile> ResizeImageAsync(Guid id, int width, int height, CancellationToken ct = default);
    Task<StoredFile> GenerateThumbnailAsync(Guid id, int width = 200, int height = 200, CancellationToken ct = default);
    
    // Validation
    bool IsValidFileType(string contentType, FileCategory category);
    long GetMaxFileSizeBytes(FileCategory category);
}

/// <summary>
/// File storage configuration
/// </summary>
public class FileStorageOptions
{
    public StorageProvider DefaultProvider { get; set; } = StorageProvider.Local;
    public string LocalBasePath { get; set; } = "wwwroot/uploads";
    public string BaseUrl { get; set; } = "/uploads";
    
    // Cloud storage
    public string? AzureConnectionString { get; set; }
    public string? AzureContainerName { get; set; }
    public string? AwsAccessKey { get; set; }
    public string? AwsSecretKey { get; set; }
    public string? AwsBucketName { get; set; }
    public string? AwsRegion { get; set; }
    
    // Limits
    public long MaxImageSizeBytes { get; set; } = 10 * 1024 * 1024; // 10MB
    public long MaxVideoSizeBytes { get; set; } = 500 * 1024 * 1024; // 500MB
    public long MaxAudioSizeBytes { get; set; } = 100 * 1024 * 1024; // 100MB
    public long MaxDocumentSizeBytes { get; set; } = 50 * 1024 * 1024; // 50MB
    
    // Allowed types
    public string[] AllowedImageTypes { get; set; } = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    public string[] AllowedVideoTypes { get; set; } = ["video/mp4", "video/webm", "video/quicktime"];
    public string[] AllowedAudioTypes { get; set; } = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"];
    public string[] AllowedDocumentTypes { get; set; } = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
}
