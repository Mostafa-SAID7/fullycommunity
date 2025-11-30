using CommunityCar.Domain.Common;
using CommunityCar.Domain.Entities.Identity;

namespace CommunityCar.Domain.Entities.Marketplace.Common;

/// <summary>
/// Marketplace seller profile
/// </summary>
public class Seller : BaseEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public string StoreName { get; set; } = string.Empty;
    public string? StoreDescription { get; set; }
    public string? LogoUrl { get; set; }
    public string? BannerUrl { get; set; }
    public string? Slug { get; set; }
    
    public SellerType Type { get; set; } = SellerType.Individual;
    public SellerStatus Status { get; set; } = SellerStatus.Pending;
    
    // Contact
    public string? BusinessPhone { get; set; }
    public string? BusinessEmail { get; set; }
    public string? Website { get; set; }
    
    // Location
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    
    // Business Info
    public string? BusinessRegistrationNumber { get; set; }
    public string? TaxId { get; set; }
    public bool IsVerifiedBusiness { get; set; }
    public DateTime? VerifiedAt { get; set; }
    
    // Policies
    public string? ReturnPolicy { get; set; }
    public string? ShippingPolicy { get; set; }
    public int ReturnDays { get; set; } = 30;
    public bool AcceptsReturns { get; set; } = true;
    
    // Stats
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalSales { get; set; }
    public int TotalListings { get; set; }
    public int ActiveListings { get; set; }
    public decimal TotalRevenue { get; set; }
    
    // Response
    public double ResponseRate { get; set; }
    public int AverageResponseHours { get; set; }
    
    // Categories
    public List<MarketplaceCategory> Categories { get; set; } = [];
    
    // Payment
    public bool AcceptsEscrow { get; set; }
    public bool OffersFinancing { get; set; }
    public string? PaymentInfoJson { get; set; }
    
    // Badges
    public bool IsTopRatedSeller { get; set; }
    public bool IsPowerSeller { get; set; }
    public bool IsVerifiedSeller { get; set; }
}

public enum SellerStatus { Pending, Active, Suspended, Banned }
