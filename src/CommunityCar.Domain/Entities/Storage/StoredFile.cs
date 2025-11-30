using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Storage;

/// <summary>
/// Stored file metadata - tracks all uploaded files
/// </summary>
public class StoredFile : BaseEntity
{
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string Extension { get; set; } = string.Empty;
    
    // Storage location
    public StorageProvider Provider { get; set; } = StorageProvider.Local;
    public string Path { get; set; } = string.Empty; // Relative path
    public string? Url { get; set; } // Full URL for CDN/cloud
    public string? ThumbnailUrl { get; set; }
    
    // Categorization
    public FileCategory Category { get; set; }
    public string? EntityType { get; set; } // Post, Product, User, etc.
    public Guid? EntityId { get; set; }
    
    // Ownership
    public Guid? UploadedById { get; set; }
    
    // Image specific
    public int? Width { get; set; }
    public int? Height { get; set; }
    
    // Video/Audio specific
    public TimeSpan? Duration { get; set; }
    
    // Processing
    public bool IsProcessed { get; set; }
    public string? ProcessingError { get; set; }
    
    // Security
    public string? Hash { get; set; } // For duplicate detection
    public bool IsPublic { get; set; } = true;
    public DateTime? ExpiresAt { get; set; }
}

public enum StorageProvider
{
    Local,
    AzureBlob,
    AwsS3,
    GoogleCloud,
    Cloudinary
}

public enum FileCategory
{
    // User related
    Avatar,
    ProfileBackground,
    
    // Content
    PostImage,
    PostVideo,
    PostAttachment,
    
    // Community
    GroupCover,
    GroupAvatar,
    EventCover,
    GuideCover,
    GuideStepImage,
    
    // Marketplace
    ProductImage,
    ProductVideo,
    SellerLogo,
    
    // Services
    ServiceProviderLogo,
    ServiceImage,
    
    // Podcasts
    PodcastCover,
    PodcastBanner,
    EpisodeAudio,
    EpisodeThumbnail,
    
    // Videos
    ChannelAvatar,
    ChannelBanner,
    VideoFile,
    VideoThumbnail,
    
    // Pages
    PageImage,
    PageBanner,
    
    // System
    SiteLogo,
    SiteFavicon,
    EmailTemplate,
    Document
}
