namespace CommunityCar.Infrastructure.External.Storage;

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream stream, string fileName, string contentType, string? folder = null);
    Task<Stream?> DownloadAsync(string fileUrl);
    Task<bool> DeleteAsync(string fileUrl);
    Task<string> GetSignedUrlAsync(string fileUrl, TimeSpan expiration);
}

public record FileUploadResult(
    string Url,
    string FileName,
    string ContentType,
    long Size
);
