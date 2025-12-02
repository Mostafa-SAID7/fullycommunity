using CommunityCar.Application.Common.Interfaces;
using CommunityCar.Domain.Entities.Identity;
using CommunityCar.Infrastructure.Data;
using CommunityCar.Infrastructure.Services.Identity;
using CommunityCar.Infrastructure.Services.Notification;
using CommunityCar.Infrastructure.Services.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace CommunityCar.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
            .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));

        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

        // Identity
        services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
        {
            options.Password.RequiredLength = 8;
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedEmail = true;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
            options.Lockout.MaxFailedAccessAttempts = 5;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

        // JWT Authentication
        var jwtKey = configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                ValidateIssuer = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });


        // Caching
        services.AddDistributedMemoryCache();

        // HTTP Clients
        services.AddHttpClient("HaveIBeenPwned", client =>
        {
            client.BaseAddress = new Uri("https://api.pwnedpasswords.com/");
            client.DefaultRequestHeaders.Add("User-Agent", "CommunityCar-Security-Check");
        });

        // Core Services
        services.AddScoped<IJwtService, Services.Identity.JwtService>();
        services.AddScoped<ICurrentUserService, Services.Identity.CurrentUserService>();
        services.AddScoped<IAuditService, Services.Identity.AuditService>();
        services.AddScoped<IDeviceService, Services.Identity.DeviceService>();
        services.AddScoped<ISessionService, Services.Identity.SessionService>();
        services.AddScoped<IActivityService, Services.Identity.ActivityService>();
        services.AddScoped<ISecurityService, Services.Security.SecurityService>();
        services.AddScoped<ITwoFactorService, Services.Identity.TwoFactorService>();
        services.AddScoped<INotificationService, Services.Notification.NotificationService>();
        services.AddScoped<IGeoLocationService, Services.Security.GeoLocationService>();
        services.AddScoped<IIpSecurityService, Services.Security.IpSecurityService>();
        services.AddScoped<IBreachDetectionService, Services.Security.BreachDetectionService>();

        // Identity Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IVerificationService, VerificationService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IAdminUserService, AdminUserService>();

        // Localization
        services.AddScoped<ILocalizationService, Services.Localization.LocalizationService>();

        // File Storage
        services.Configure<FileStorageOptions>(configuration.GetSection("FileStorage"));
        services.AddScoped<IFileStorageService, Services.Storage.FileStorageService>();

        // Search
        services.AddScoped<ISearchService, Services.Search.SearchService>();

        // Messaging
        services.AddScoped<Application.Common.Interfaces.Messaging.IChatService, Services.Messaging.ChatService>();

        return services;
    }
}
