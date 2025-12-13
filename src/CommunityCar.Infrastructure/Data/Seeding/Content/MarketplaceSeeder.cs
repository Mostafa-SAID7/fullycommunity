using CommunityCar.Domain.Entities.Marketplace.Common;
using CommunityCar.Domain.Entities.Marketplace.Products;
using CommunityCar.Infrastructure.Data.Seeding.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CommunityCar.Infrastructure.Data.Seeding.Content;

public class MarketplaceSeeder : BaseSeeder
{
    public MarketplaceSeeder(AppDbContext context, ILogger<MarketplaceSeeder> logger) : base(context, logger) { }

    public override int Order => 60;
    public override string Name => "Marketplace Content";

    public override async Task<bool> ShouldSeedAsync()
    {
        return !await Context.Set<Seller>().AnyAsync();
    }

    protected override async Task ExecuteSeedAsync()
    {
        var users = await Context.Users.Take(10).ToListAsync();
        if (!users.Any()) return;

        var random = new Random(42);

        // Create sellers
        var sellers = new List<Seller>();
        var sellerData = new (string Name, string Desc, SellerType Type, bool Verified, double Rating)[]
        {
            ("Classic Parts Warehouse", "Your one-stop shop for classic car parts. 30+ years in business.", SellerType.Dealer, true, 4.8),
            ("AutoPro Performance", "High-performance parts and accessories for enthusiasts.", SellerType.Vendor, true, 4.6),
            ("Vintage Auto Supply", "Specializing in rare and hard-to-find vintage parts.", SellerType.Dealer, true, 4.9),
            ("DIY Mechanic Shop", "Quality parts at affordable prices for home mechanics.", SellerType.Individual, false, 4.3),
            ("EV Parts Direct", "Electric vehicle parts and accessories.", SellerType.Vendor, true, 4.5),
            ("Luxury Auto Accessories", "Premium accessories for luxury vehicles.", SellerType.Dealer, true, 4.7),
            ("Track Day Essentials", "Everything you need for track day success.", SellerType.Individual, false, 4.4),
            ("Restoration Specialists", "OEM and reproduction parts for restorations.", SellerType.Dealer, true, 4.8)
        };

        for (int i = 0; i < sellerData.Length && i < users.Count; i++)
        {
            var (name, desc, type, verified, rating) = sellerData[i];
            var slug = name.ToLower().Replace(" ", "-");
            sellers.Add(new Seller
            {
                Id = Guid.NewGuid(),
                UserId = users[i].Id,
                StoreName = name,
                StoreDescription = desc,
                Slug = slug,
                LogoUrl = $"https://i.pravatar.cc/200?u={slug}",
                BannerUrl = $"https://picsum.photos/seed/{slug}/1200/300",
                Type = type,
                Status = SellerStatus.Active,
                IsVerifiedBusiness = verified,
                VerifiedAt = verified ? DateTime.UtcNow.AddMonths(-6) : null,
                AverageRating = rating,
                TotalReviews = random.Next(50, 500),
                TotalSales = random.Next(100, 2000),
                TotalListings = 0,
                ActiveListings = 0,
                ResponseRate = 85 + random.Next(15),
                AverageResponseHours = random.Next(1, 24),
                AcceptsReturns = true,
                ReturnDays = 30,
                Country = "United States",
                IsTopRatedSeller = rating >= 4.7,
                IsPowerSeller = random.Next(10) > 5,
                IsVerifiedSeller = verified,
                CreatedAt = DateTime.UtcNow.AddMonths(-random.Next(6, 36))
            });
        }
        await Context.Set<Seller>().AddRangeAsync(sellers);
        await Context.SaveChangesAsync(); // Save sellers first to satisfy FK constraint

        // Create products
        var products = new List<Product>();
        var productData = new (string Title, string Desc, MarketplaceCategory Cat, decimal Price, ProductCondition Cond, string Brand)[]
        {
            // Parts & Servicing
            ("Brembo GT Brake Kit - Front", "High-performance 6-piston brake kit with slotted rotors. Fits most sports cars.", MarketplaceCategory.PartsServicing, 2499.99m, ProductCondition.New, "Brembo"),
            ("K&N Cold Air Intake System", "Increase horsepower and throttle response with this bolt-on intake system.", MarketplaceCategory.PartsServicing, 349.99m, ProductCondition.New, "K&N"),
            ("Bilstein B8 Performance Shocks", "Set of 4 performance shocks for improved handling.", MarketplaceCategory.PartsServicing, 899.99m, ProductCondition.New, "Bilstein"),
            ("NGK Iridium Spark Plugs (Set of 6)", "Premium iridium spark plugs for optimal performance.", MarketplaceCategory.PartsServicing, 89.99m, ProductCondition.New, "NGK"),
            ("Bosch Platinum Wiper Blades", "All-weather performance wiper blades, 24\" + 20\" set.", MarketplaceCategory.PartsServicing, 45.99m, ProductCondition.New, "Bosch"),
            
            // Accessories
            ("WeatherTech Floor Mats - Universal", "Custom-fit all-weather floor mats. Laser measured for perfect fit.", MarketplaceCategory.AccessoriesAutomobilia, 189.99m, ProductCondition.New, "WeatherTech"),
            ("Thule Roof Rack System", "Aerodynamic roof rack for cargo carriers and bike mounts.", MarketplaceCategory.AccessoriesAutomobilia, 449.99m, ProductCondition.New, "Thule"),
            ("Pioneer Double DIN Head Unit", "Apple CarPlay & Android Auto compatible touchscreen.", MarketplaceCategory.AccessoriesAutomobilia, 599.99m, ProductCondition.New, "Pioneer"),
            ("LED Interior Light Kit", "Complete interior LED upgrade kit with 12 bulbs.", MarketplaceCategory.AccessoriesAutomobilia, 49.99m, ProductCondition.New, "Generic"),
            
            // Car Care
            ("Meguiar's Complete Car Care Kit", "Everything you need for a showroom shine.", MarketplaceCategory.CarCareProducts, 79.99m, ProductCondition.New, "Meguiar's"),
            ("Chemical Guys Foam Cannon", "Professional-grade foam cannon for pressure washers.", MarketplaceCategory.CarCareProducts, 89.99m, ProductCondition.New, "Chemical Guys"),
            ("Ceramic Coating Kit - 3 Year Protection", "Professional ceramic coating with all application tools.", MarketplaceCategory.CarCareProducts, 149.99m, ProductCondition.New, "Gtechniq"),
            
            // Tyres & Wheels
            ("Michelin Pilot Sport 4S - 255/35R19", "Ultra-high performance summer tire. Price per tire.", MarketplaceCategory.TyresWheels, 329.99m, ProductCondition.New, "Michelin"),
            ("BBS CH-R 19\" Wheels (Set of 4)", "Lightweight forged wheels in satin black.", MarketplaceCategory.TyresWheels, 3299.99m, ProductCondition.New, "BBS"),
            ("Wheel Spacers 15mm (Pair)", "Hub-centric wheel spacers with extended bolts.", MarketplaceCategory.TyresWheels, 89.99m, ProductCondition.New, "H&R"),
            
            // Tools
            ("Craftsman 450-Piece Mechanic's Tool Set", "Complete tool set in rolling cabinet.", MarketplaceCategory.Tools, 599.99m, ProductCondition.New, "Craftsman"),
            ("OBD2 Diagnostic Scanner Pro", "Professional-grade diagnostic tool with live data.", MarketplaceCategory.Tools, 199.99m, ProductCondition.New, "BlueDriver"),
            ("3-Ton Floor Jack with Stands", "Low-profile aluminum racing jack with jack stands.", MarketplaceCategory.Tools, 249.99m, ProductCondition.New, "Arcan"),
            ("Torque Wrench Set (3-Piece)", "1/4\", 3/8\", and 1/2\" drive torque wrenches.", MarketplaceCategory.Tools, 179.99m, ProductCondition.New, "Tekton"),
            
            // Used/Vintage Parts
            ("1967 Mustang Fastback Tail Lights (Pair)", "Original OEM tail lights in excellent condition.", MarketplaceCategory.PartsServicing, 450.00m, ProductCondition.Excellent, "Ford OEM"),
            ("Porsche 911 (993) Sport Exhaust", "Genuine Porsche sport exhaust, low miles.", MarketplaceCategory.PartsServicing, 1899.99m, ProductCondition.Good, "Porsche"),
            ("BMW E30 M3 S14 Engine", "Complete running engine with 85k miles. Includes ECU.", MarketplaceCategory.PartsServicing, 12500.00m, ProductCondition.Good, "BMW"),
            ("Mercedes W124 Wood Trim Set", "Complete interior wood trim in walnut. Minor wear.", MarketplaceCategory.AccessoriesAutomobilia, 650.00m, ProductCondition.Good, "Mercedes-Benz"),
            
            // Car Covers
            ("Covercraft Custom Car Cover", "Indoor/outdoor protection with mirror pockets.", MarketplaceCategory.CarCovers, 299.99m, ProductCondition.New, "Covercraft"),
            ("Portable Car Canopy Garage", "Instant garage shelter 10x20 feet.", MarketplaceCategory.CarCovers, 449.99m, ProductCondition.New, "ShelterLogic")
        };

        foreach (var (title, desc, cat, price, cond, brand) in productData)
        {
            var seller = sellers[random.Next(sellers.Count)];
            var slug = title.ToLower()
                .Replace(" ", "-")
                .Replace("\"", "")
                .Replace("(", "")
                .Replace(")", "")
                .Replace("&", "and")
                .Replace("'", "");
            
            var product = new Product
            {
                Id = Guid.NewGuid(),
                SellerId = seller.Id,
                Title = title,
                Description = desc,
                Slug = slug.Length > 80 ? slug[..80] : slug,
                SKU = $"SKU-{random.Next(10000, 99999)}",
                Category = cat,
                ListingType = ListingType.FixedPrice,
                Status = ListingStatus.Active,
                Condition = cond,
                Price = price,
                OriginalPrice = cond == ProductCondition.New ? price * 1.15m : null,
                AcceptsBestOffer = cond != ProductCondition.New,
                MinOfferPrice = cond != ProductCondition.New ? price * 0.8m : null,
                Currency = "USD",
                Quantity = cond == ProductCondition.New ? random.Next(5, 50) : 1,
                Brand = brand,
                WarrantyType = cond == ProductCondition.New ? WarrantyType.Manufacturer : WarrantyType.None,
                WarrantyMonths = cond == ProductCondition.New ? 12 : 0,
                FreeShipping = price > 100,
                ShippingCost = price > 100 ? null : 9.99m,
                LocalPickupAvailable = true,
                ShipsFrom = "United States",
                HandlingDays = random.Next(1, 3),
                ViewCount = random.Next(100, 5000),
                WatchCount = random.Next(10, 200),
                PublishedAt = DateTime.UtcNow.AddDays(-random.Next(1, 90)),
                Tags = new List<string> { "automotive", cat.ToString().ToLower(), brand.ToLower().Replace(" ", "-") },
                IsFeatured = random.Next(10) > 7,
                CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 90))
            };
            products.Add(product);
            seller.TotalListings++;
            seller.ActiveListings++;
        }
        await Context.Set<Product>().AddRangeAsync(products);
        Context.Set<Seller>().UpdateRange(sellers);
        await Context.SaveChangesAsync(); // Save products before adding images to satisfy FK constraint

        // Create product images
        var images = new List<ProductImage>();
        foreach (var product in products)
        {
            var imageCount = random.Next(2, 5);
            for (int i = 0; i < imageCount; i++)
            {
                images.Add(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    Url = $"https://picsum.photos/seed/{product.Id}-{i}/800/600",
                    ThumbnailUrl = $"https://picsum.photos/seed/{product.Id}-{i}/200/150",
                    AltText = $"{product.Title} - Image {i + 1}",
                    SortOrder = i,
                    IsPrimary = i == 0,
                    CreatedAt = product.CreatedAt
                });
            }
        }
        await Context.Set<ProductImage>().AddRangeAsync(images);

        Logger.LogInformation("Seeded {SellerCount} sellers, {ProductCount} products, {ImageCount} images",
            sellers.Count, products.Count, images.Count);
    }
}
