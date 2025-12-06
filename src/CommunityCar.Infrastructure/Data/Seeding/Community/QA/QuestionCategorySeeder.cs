using CommunityCar.Domain.Entities.Community.QA;
using CommunityCar.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CommunityCar.Infrastructure.Data.Seeding.Community.QA;

public static class QuestionCategorySeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.QuestionCategories.AnyAsync()) return;

        var categories = new List<QuestionCategory>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "General",
                Slug = "general",
                Description = "General car-related questions",
                IsActive = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Maintenance",
                Slug = "maintenance",
                Description = "Car maintenance and repair questions",
                IsActive = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Electric Vehicles",
                Slug = "electric-vehicles",
                Description = "Questions about electric and hybrid vehicles",
                IsActive = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Buying & Selling",
                Slug = "buying-selling",
                Description = "Questions about buying and selling cars",
                IsActive = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Safety",
                Slug = "safety",
                Description = "Car safety and security questions",
                IsActive = true
            }
        };

        context.QuestionCategories.AddRange(categories);
        await context.SaveChangesAsync();
    }
}
