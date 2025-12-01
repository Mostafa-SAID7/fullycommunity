# CommunityCar Angular Apps

This workspace now contains two separate Angular applications:

## 🚗 Main App (`community-car-main`)
**Purpose**: Public website and user dashboards
- **Port**: 4200
- **Users**: Public users, Experts, Reviewers, Content Creators
- **Features**:
  - Public home page
  - User authentication
  - User dashboards (Expert, Reviewer, Content Creator)
  - Podcasts and content consumption
  - Community features

## 🛠️ Admin App (`community-car-admin`)
**Purpose**: Administrative dashboard
- **Port**: 4201
- **Users**: Administrators only
- **Features**:
  - User management
  - Content moderation
  - System analytics
  - Admin settings
  - Reports and monitoring

## 🚀 Development Commands

### Start Both Apps
```bash
# Start main app (port 4200)
npm run start:main

# Start admin app (port 4201)
npm run start:admin

# Start both (default starts main)
npm start
```

### Build Commands
```bash
# Build both apps
npm run build

# Build main app only
npm run build:main

# Build admin app only
npm run build:admin
```

## 📁 Project Structure

```
ClientApp/
├── projects/
│   ├── main/                 # Main public app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── features/
│   │   │   │   │   ├── dashboard/    # User dashboards
│   │   │   │   │   ├── podcasts/     # Podcast features
│   │   │   │   │   └── auth/         # Authentication
│   │   │   │   └── shared/           # Shared components
│   │   │   └── environments/
│   │   └── tsconfig.app.json
│   └── admin/                # Admin dashboard app
│       ├── src/
│       │   ├── app/
│       │   │   ├── features/
│       │   │   │   └── admin/        # Admin features
│       │   │   │       ├── dashboard/
│       │   │   │       ├── users/
│       │   │   │       ├── content/
│       │   │   │       └── moderation/
│       │   │   └── shared/
│       │   └── environments/
│       └── tsconfig.app.json
├── angular.json
├── package.json
└── tsconfig.json
```

## 🔐 User Roles & Access

### Main App Roles:
- **Expert**: Answer questions, provide expertise
- **Reviewer**: Write and manage reviews
- **Content Creator**: Create guides, videos, podcasts
- **Regular User**: Consume content, ask questions

### Admin App Roles:
- **Super Admin**: Full system access
- **Content Moderator**: Content management only
- **User Manager**: User management only

## 🌐 URLs in Development

- **Main App**: http://localhost:4200
- **Admin App**: http://localhost:4201

## 🔧 Configuration

Each app has its own:
- Environment configuration
- TypeScript configuration
- Build settings
- Routing configuration

The apps share:
- Dependencies (package.json)
- Base TypeScript config
- Angular CLI workspace config