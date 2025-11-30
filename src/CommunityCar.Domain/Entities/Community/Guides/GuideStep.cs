using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Community.Guides;

public class GuideStep
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    
    // Media
    public List<GuideStepMedia> Media { get; set; } = [];
    
    // Tips & Warnings
    public string? Tip { get; set; }
    public string? Warning { get; set; }
    
    // Tools/Parts needed for this step
    public string? ToolsRequired { get; set; }
    public string? PartsRequired { get; set; }
    
    public int? EstimatedMinutes { get; set; }
}

public class GuideStepMedia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid StepId { get; set; }
    public GuideStep Step { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public int SortOrder { get; set; }
}

public class GuideRating
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public int Rating { get; set; } // 1-5
    public string? Review { get; set; }
    public bool IsHelpful { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class GuideComment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    public Guid AuthorId { get; set; }
    public ApplicationUser Author { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public GuideComment? Parent { get; set; }
    public int LikeCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class GuideBookmark
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
