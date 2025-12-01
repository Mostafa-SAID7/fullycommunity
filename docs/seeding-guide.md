# CommunityCar Database Seeding Guide

## 🎯 Overview

The CommunityCar seeding system provides comprehensive database initialization for both the **Main Application** (public users) and **Admin Application** (administrators). It's designed to support different environments with appropriate data sets.

## 🏗️ Architecture

### Organized Structure
```
src/CommunityCar.Infrastructure/Data/Seeding/
├── Core/                    # Base framework
├── Identity/               # Users & roles
├── Content/                # Demo content
├── Configuration/          # Settings
├── Extensions/             # Helper methods
├── Helpers/                # Utilities
└── Models/                 # Status tracking
```

### Execution Flow
1. **Environment Detection** → Determines seeding strategy
2. **Dependency Order** → Roles → Admin Users → Demo Users → Content
3. **Safety Checks** → Prevents duplicate seeding
4. **Error Handling** → Graceful failure with logging

## 👥 User Accounts Created

### 🛠️ Admin Application Users
| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| SuperAdmin | `superadmin@communitycar.com` | `SuperAdmin@123!` | Full system access |
| Admin | `admin@communitycar.com` | `Admin@123!` | System administration |
| Moderator | `moderator@communitycar.com` | `Moderator@123!` | Content moderation |

### 🚗 Main Application Users
All demo users use password: `Demo@123!`

#### Expert Users (Answer questions, provide expertise)
- `john.expert@demo.com` - BMW/Mercedes specialist
- `sarah.mechanic@demo.com` - Hybrid/EV specialist

#### Reviewer Users (Write and manage reviews)
- `mike.reviewer@demo.com` - Service center reviewer
- `lisa.reviewer@demo.com` - Product reviewer

#### Content Creators (Create guides, tutorials)
- `alex.creator@demo.com` - Tutorial creator
- `emma.blogger@demo.com` - Automotive blogger

#### Regular Users (Community members)
- `david.user@demo.com` - Car owner seeking advice
- `jennifer.driver@demo.com` - New car owner

#### Business Users
- `garage.owner@demo.com` - Service center owner
- `parts.vendor@demo.com` - Auto parts vendor

## 📊 Demo Content

### Community Features
- **4 Questions** covering common automotive topics
- **4 Reviews** of service centers and products
- **3 Guides** with step-by-step instructions
- **3 Posts** for community discussions

### Podcast Content
- **3 Podcast Shows** with multiple episodes each
- **8 Episodes** covering various automotive topics
- Realistic metadata (play counts, likes, etc.)

## 🚀 Usage Instructions

### Automatic Seeding (Recommended)
Seeding runs automatically when the application starts:

```bash
# Development - Full demo data
dotnet run

# Production - Essential data only
dotnet run --environment Production
```

### Manual Seeding Commands
```bash
# Seed everything
dotnet run seed all

# Production mode (essential only)
dotnet run seed all --production

# Specific components
dotnet run seed roles      # Just roles
dotnet run seed admin      # Just admin users
dotnet run seed demo       # Just demo users
dotnet run seed content    # Just demo content
```

### Environment Behavior
- **Production**: Only roles and admin users
- **Development**: Full demo data including content
- **Testing**: Configurable based on needs

## 🔐 Security Features

### Production Safety
✅ No demo data in production  
✅ Strong admin passwords  
✅ Email verification enabled  
✅ Role-based access control  
✅ Audit logging  

### Development Convenience
✅ Predictable demo passwords  
✅ Pre-verified accounts  
✅ Rich sample data  
✅ Multiple user types  

## 🎭 Role-Based Access

### Main App Dashboards
- **Expert Dashboard**: Answer questions, manage expertise areas
- **Reviewer Dashboard**: Write reviews, track helpful votes
- **Content Creator Dashboard**: Create guides, view analytics
- **User Dashboard**: General overview and activity

### Admin App Features
- **User Management**: View, edit, manage all users
- **Content Moderation**: Review reported content
- **System Analytics**: View reports and metrics
- **Settings Management**: Configure system settings

## 🛠️ Development Workflow

### Testing Different Roles
1. **Start the applications**:
   ```bash
   # Main app (port 4200)
   cd ClientApp
   npm run start:main
   
   # Admin app (port 4201)
   npm run start:admin
   ```

2. **Login with different accounts** to test role-specific features

3. **Use demo content** to test interactions and workflows

### Adding New Demo Data
1. **Extend existing seeders** with new sample data
2. **Maintain realistic content** for better testing
3. **Consider user relationships** (who created what)
4. **Update documentation** with new accounts/data

## 📝 Logging & Monitoring

### Seeding Logs
- Seeder execution order and timing
- Success/failure status for each component
- Item counts and performance metrics
- Error details for troubleshooting

### Example Log Output
```
🌱 Seeding development data (full demo data)...
[INFO] Starting Role Seeder
[INFO] Created Admin role: SuperAdmin
[INFO] Created User role: Expert
[INFO] Completed Role Seeder
[INFO] Starting Admin User Seeder
[INFO] Created admin user: superadmin@communitycar.com with role SuperAdmin
[INFO] Completed Admin User Seeder
✅ Database seeding completed successfully
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed**
- Ensure database server is running
- Check connection string in appsettings.json
- Verify database permissions

**Seeding Skipped**
- Check environment configuration
- Verify seeder conditions (ShouldSeedAsync)
- Review logs for specific errors

**Duplicate Data Errors**
- Seeders check for existing data
- Use `--force` flag carefully (development only)
- Clear database if needed for fresh start

### Reset Development Database
```bash
# Drop and recreate database
dotnet ef database drop
dotnet ef database update

# Or use SQL
DROP DATABASE CommunityCar;
CREATE DATABASE CommunityCar;
```

## 🚀 Next Steps

1. **Start both applications** and explore the seeded data
2. **Test role-based features** with different user accounts
3. **Customize demo data** to match your specific needs
4. **Add new seeders** for additional entities as needed

The seeding system provides a solid foundation for development and testing, with production-ready safety measures built in.