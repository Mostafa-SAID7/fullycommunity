using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Application.Common.Interfaces.Infrastructure;
using CommunityCar.Domain.Entities.Storage;
using CommunityCar.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;

namespace CommunityCar.Infrastructure.Services.Storage;

public class FileStorageService : IFileStorageService
{
    private readonly AppDbContext _context;
    private readonly FileStorageOptions _options;

    public FileStorageService(AppDbContext context, IOptions<FileStorageOptions> options)
    {
        _context = context;
        _options = options.Value;
    }

    public async Task<StoredFile> UploadAsync(IFormFile file, FileCategory category, Guid? entityId = null, string? entityType = null, CancellationToken ct = default)
    {
        if (!IsValidFileType(file.ContentType, category))
            throw new InvalidOperationException($"File type {file.ContentType} is not allowed for category {category}");

        var maxSize = GetMaxFileSizeBytes(category);
        if (file.Length > maxSize)
            throw new InvalidOperationException($"File size exceeds maximum allowed size of {maxSize / 1024 / 1024}MB");

        using var stream = file.OpenReadStream();
        return await UploadAsync(stream, file.FileName, file.ContentType, category, entityId, entityType, ct);
    }

    public async Task<StoredFile> UploadAsync(Stream stream, string fileName, string contentType, FileCategory category, Guid? entityId = null, string? entityType = null, CancellationToken ct = default)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var relativePath = GetRelativePath(category, uniqueFileName);
        var fullPath = Path.Combine(_options.LocalBasePath, relativePath);

        // Ensure directory exists
        var directory = Path.GetDirectoryName(fullPath);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            Directory.CreateDirectory(directory);

        // Calculate hash for duplicate detection
        stream.Position = 0;
        var hash = await ComputeHashAsync(stream, ct);
        stream.Position = 0;

        // Save file
        await using var fileStream = new FileStream(fullPath, FileMode.Create);
        await stream.CopyToAsync(fileStream, ct);

        var storedFile = new StoredFile
        {
            FileName = uniqueFileName,
            OriginalFileName = fileName,
            ContentType = contentType,
            SizeBytes = stream.Length,
            Extension = extension,
            Provider = StorageProvider.Local,
            Path = relativePath,
            Url = $"{_options.BaseUrl}/{relativePath.Replace("\\", "/")}",
            Category = category,
            EntityType = entityType,
            EntityId = entityId,
            Hash = hash,
            IsProcessed = true
        };

        // Get image dimensions if applicable
        if (IsImageType(contentType))
        {
            var dimensions = await GetImageDimensionsAsync(fullPath, ct);
            storedFile.Width = dimensions.Width;
            storedFile.Height = dimensions.Height;
        }

        _context.Set<StoredFile>().Add(storedFile);
        await _context.SaveChangesAsync(ct);

        return storedFile;
    }


    public async Task<StoredFile> UploadFromUrlAsync(string url, FileCategory category, Guid? entityId = null, string? entityType = null, CancellationToken ct = default)
    {
        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync(url, ct);
        response.EnsureSuccessStatusCode();

        var contentType = response.Content.Headers.ContentType?.MediaType ?? "application/octet-stream";
        var fileName = Path.GetFileName(new Uri(url).LocalPath);
        
        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        return await UploadAsync(stream, fileName, contentType, category, entityId, entityType, ct);
    }

    public async Task<List<StoredFile>> UploadMultipleAsync(IEnumerable<IFormFile> files, FileCategory category, Guid? entityId = null, string? entityType = null, CancellationToken ct = default)
    {
        var results = new List<StoredFile>();
        foreach (var file in files)
        {
            var storedFile = await UploadAsync(file, category, entityId, entityType, ct);
            results.Add(storedFile);
        }
        return results;
    }

    public async Task<StoredFile?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Set<StoredFile>().FindAsync([id], ct);
    }

    public async Task<List<StoredFile>> GetByEntityAsync(string entityType, Guid entityId, CancellationToken ct = default)
    {
        return await _context.Set<StoredFile>()
            .Where(f => f.EntityType == entityType && f.EntityId == entityId)
            .OrderBy(f => f.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<Stream?> GetStreamAsync(Guid id, CancellationToken ct = default)
    {
        var file = await GetByIdAsync(id, ct);
        if (file == null) return null;

        var fullPath = Path.Combine(_options.LocalBasePath, file.Path);
        if (!File.Exists(fullPath)) return null;

        return new FileStream(fullPath, FileMode.Open, FileAccess.Read);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var file = await GetByIdAsync(id, ct);
        if (file == null) return false;

        var fullPath = Path.Combine(_options.LocalBasePath, file.Path);
        if (File.Exists(fullPath))
            File.Delete(fullPath);

        _context.Set<StoredFile>().Remove(file);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int> DeleteByEntityAsync(string entityType, Guid entityId, CancellationToken ct = default)
    {
        var files = await GetByEntityAsync(entityType, entityId, ct);
        foreach (var file in files)
        {
            var fullPath = Path.Combine(_options.LocalBasePath, file.Path);
            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }

        _context.Set<StoredFile>().RemoveRange(files);
        await _context.SaveChangesAsync(ct);
        return files.Count;
    }

    public string GetUrl(StoredFile file) => file.Url ?? $"{_options.BaseUrl}/{file.Path.Replace("\\", "/")}";

    public string GetThumbnailUrl(StoredFile file, int width = 200, int height = 200)
    {
        return file.ThumbnailUrl ?? GetUrl(file);
    }

    public Task<string> GetSignedUrlAsync(Guid id, TimeSpan expiry, CancellationToken ct = default)
    {
        // For local storage, just return the regular URL
        // Cloud providers would generate signed URLs here
        return Task.FromResult($"{_options.BaseUrl}/{id}");
    }

    public Task<StoredFile> ResizeImageAsync(Guid id, int width, int height, CancellationToken ct = default)
    {
        throw new NotImplementedException("Image resizing requires ImageSharp or similar library");
    }

    public Task<StoredFile> GenerateThumbnailAsync(Guid id, int width = 200, int height = 200, CancellationToken ct = default)
    {
        throw new NotImplementedException("Thumbnail generation requires ImageSharp or similar library");
    }


    public bool IsValidFileType(string contentType, FileCategory category)
    {
        return category switch
        {
            FileCategory.Avatar or FileCategory.ProfileBackground or FileCategory.PostImage or 
            FileCategory.GroupCover or FileCategory.GroupAvatar or FileCategory.EventCover or 
            FileCategory.GuideCover or FileCategory.GuideStepImage or FileCategory.ProductImage or 
            FileCategory.ServiceProviderLogo or FileCategory.ServiceImage or FileCategory.PodcastCover or 
            FileCategory.PodcastBanner or FileCategory.EpisodeThumbnail or FileCategory.ChannelAvatar or 
            FileCategory.ChannelBanner or FileCategory.VideoThumbnail or FileCategory.PageImage or 
            FileCategory.PageBanner or FileCategory.SiteLogo or FileCategory.SiteFavicon 
                => _options.AllowedImageTypes.Contains(contentType),
            
            FileCategory.PostVideo or FileCategory.ProductVideo or FileCategory.VideoFile 
                => _options.AllowedVideoTypes.Contains(contentType),
            
            FileCategory.EpisodeAudio 
                => _options.AllowedAudioTypes.Contains(contentType),
            
            FileCategory.PostAttachment or FileCategory.Document or FileCategory.EmailTemplate 
                => _options.AllowedDocumentTypes.Contains(contentType) || _options.AllowedImageTypes.Contains(contentType),
            
            _ => true
        };
    }

    public long GetMaxFileSizeBytes(FileCategory category)
    {
        return category switch
        {
            FileCategory.PostVideo or FileCategory.ProductVideo or FileCategory.VideoFile 
                => _options.MaxVideoSizeBytes,
            FileCategory.EpisodeAudio 
                => _options.MaxAudioSizeBytes,
            FileCategory.PostAttachment or FileCategory.Document or FileCategory.EmailTemplate 
                => _options.MaxDocumentSizeBytes,
            _ => _options.MaxImageSizeBytes
        };
    }

    private static string GetRelativePath(FileCategory category, string fileName)
    {
        var folder = category switch
        {
            FileCategory.Avatar or FileCategory.ProfileBackground => "users",
            FileCategory.PostImage or FileCategory.PostVideo or FileCategory.PostAttachment => "posts",
            FileCategory.GroupCover or FileCategory.GroupAvatar => "groups",
            FileCategory.EventCover => "events",
            FileCategory.GuideCover or FileCategory.GuideStepImage => "guides",
            FileCategory.ProductImage or FileCategory.ProductVideo => "products",
            FileCategory.SellerLogo => "sellers",
            FileCategory.ServiceProviderLogo or FileCategory.ServiceImage => "services",
            FileCategory.PodcastCover or FileCategory.PodcastBanner => "podcasts/shows",
            FileCategory.EpisodeAudio or FileCategory.EpisodeThumbnail => "podcasts/episodes",
            FileCategory.ChannelAvatar or FileCategory.ChannelBanner => "videos/channels",
            FileCategory.VideoFile or FileCategory.VideoThumbnail => "videos/content",
            FileCategory.PageImage or FileCategory.PageBanner => "pages",
            FileCategory.SiteLogo or FileCategory.SiteFavicon => "site",
            FileCategory.EmailTemplate => "templates",
            FileCategory.Document => "documents",
            _ => "misc"
        };

        var date = DateTime.UtcNow;
        return Path.Combine(folder, date.Year.ToString(), date.Month.ToString("D2"), fileName);
    }

    private static bool IsImageType(string contentType) => contentType.StartsWith("image/");

    private static async Task<string> ComputeHashAsync(Stream stream, CancellationToken ct)
    {
        using var sha256 = SHA256.Create();
        var hashBytes = await sha256.ComputeHashAsync(stream, ct);
        return Convert.ToHexString(hashBytes);
    }

    private static Task<(int Width, int Height)> GetImageDimensionsAsync(string path, CancellationToken ct)
    {
        // Simplified - would use ImageSharp or similar in production
        return Task.FromResult((0, 0));
    }
}
