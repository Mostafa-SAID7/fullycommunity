using CommunityCar.Domain.Common;

namespace CommunityCar.Domain.Entities.Pages;

/// <summary>
/// Job/career position listing
/// </summary>
public class CareerPosition : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public EmploymentType EmploymentType { get; set; } = EmploymentType.FullTime;
    public WorkplaceType WorkplaceType { get; set; } = WorkplaceType.Hybrid;
    public ExperienceLevel ExperienceLevel { get; set; } = ExperienceLevel.MidLevel;
    
    public string Description { get; set; } = string.Empty;
    public string? Requirements { get; set; }
    public string? Responsibilities { get; set; }
    public string? Benefits { get; set; }
    
    public string? SalaryRange { get; set; }
    public string? Currency { get; set; }
    
    public List<string> Skills { get; set; } = [];
    public List<string> Tags { get; set; } = [];
    
    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsUrgent { get; set; }
    
    public DateTime? ApplicationDeadline { get; set; }
    public string? ApplicationUrl { get; set; }
    public string? ApplicationEmail { get; set; }
    
    // Stats
    public int ViewCount { get; set; }
    public int ApplicationCount { get; set; }
    
    // SEO
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    
    // Navigation
    public List<CareerApplication> Applications { get; set; } = [];
}

public enum EmploymentType { FullTime, PartTime, Contract, Internship, Freelance }
public enum WorkplaceType { OnSite, Remote, Hybrid }
public enum ExperienceLevel { Entry, Junior, MidLevel, Senior, Lead, Executive }
