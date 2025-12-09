# Project Structure

## Root Organization

```
fullycommunity/
├── src/                    # .NET Backend (Clean Architecture)
├── ClientApp/              # Angular Frontend (Multi-project)
├── Mobile/                 # Flutter Mobile App
├── AiAgent/                # Python AI Service
├── .devops/                # Docker, K8s, nginx configs
├── .github/                # CI/CD workflows
└── docs/                   # Documentation
```

## Backend Structure (src/)

Clean Architecture with clear separation of concerns:

```
src/
├── CommunityCar.Domain/           # Core business entities and logic
│   ├── Common/                    # Base classes (BaseEntity, ValueObject, etc.)
│   ├── Entities/                  # Domain entities organized by feature
│   │   ├── Identity/              # Users, roles, sessions, devices
│   │   ├── Community/             # Posts, groups, events, QA, guides, etc.
│   │   ├── Marketplace/           # Products, orders, auctions
│   │   ├── Services/              # Service bookings and providers
│   │   ├── Podcasts/              # Shows, episodes
│   │   ├── Videos/                # Channels, videos, streams
│   │   └── ...
│   ├── Enums/                     # Domain enumerations
│   ├── Events/                    # Domain events
│   ├── Exceptions/                # Domain-specific exceptions
│   ├── ValueObjects/              # Value objects (Email, Address, Money, etc.)
│   └── Constants/                 # Domain constants (SD.cs, AdminPermissions.cs)
│
├── CommunityCar.Application/      # Business logic and use cases
│   ├── Common/
│   │   ├── Behaviors/             # MediatR pipeline behaviors (validation, logging, etc.)
│   │   ├── Interfaces/            # Service interfaces organized by domain
│   │   ├── Mappings/              # AutoMapper profiles
│   │   ├── Models/                # Shared DTOs and models
│   │   ├── Pagination/            # Pagination helpers
│   │   └── Security/              # Authorization attributes
│   ├── Features/                  # CQRS commands/queries by feature
│   │   ├── Identity/              # Auth commands/queries
│   │   ├── Admin/                 # Admin dashboard features
│   │   ├── Marketplace/           # Marketplace operations
│   │   ├── Services/              # Service booking operations
│   │   └── ...
│   ├── DTOs/                      # Request/Response DTOs
│   └── DependencyInjection.cs     # Service registration
│
├── CommunityCar.Infrastructure/   # External concerns and data access
│   ├── Data/
│   │   ├── AppDbContext.cs        # EF Core DbContext
│   │   ├── Configurations/        # Entity configurations
│   │   ├── Interceptors/          # EF interceptors (audit, soft delete)
│   │   └── Seeding/               # Database seeders
│   ├── Repositories/              # Repository implementations
│   ├── Services/                  # Service implementations organized by domain
│   │   ├── Identity/              # Auth, JWT, user services
│   │   ├── Security/              # Security, breach detection, geo-location
│   │   ├── Community/             # Community feature services
│   │   ├── Notification/          # Notification service
│   │   ├── Storage/               # File storage service
│   │   └── ...
│   ├── External/                  # Third-party integrations
│   │   ├── Email/
│   │   ├── Sms/
│   │   ├── Payment/
│   │   └── Storage/
│   ├── Migrations/                # EF Core migrations
│   └── DependencyInjection.cs     # Infrastructure service registration
│
├── CommunityCar.API/              # Web API presentation layer
│   ├── Controllers/               # API controllers organized by domain
│   │   ├── Admin/                 # Admin endpoints (auth, dashboard, seeding)
│   │   ├── Community/             # Community features (posts, groups, events, QA, etc.)
│   │   ├── Marketplace/           # Marketplace endpoints
│   │   ├── Services/              # Service booking endpoints
│   │   ├── Podcasts/              # Podcast endpoints
│   │   ├── Videos/                # Video endpoints
│   │   ├── Public/                # Public pages (about, contact, FAQ, legal)
│   │   ├── Home/                  # Home page features (trending, stories)
│   │   ├── Common/                # Shared endpoints (files, localization, search)
│   │   └── Mobile/                # Mobile-specific endpoints
│   ├── Hubs/                      # SignalR hubs (ChatHub, NotificationHub)
│   ├── Middleware/                # Custom middleware (logging, rate limiting, etc.)
│   ├── Filters/                   # Action filters (validation, exception handling)
│   ├── Configuration/             # Configuration classes
│   ├── Extensions/                # Extension methods
│   ├── Resources/Localization/    # Localization JSON files (en.json, ar.json)
│   ├── wwwroot/                   # Static files and uploads
│   └── Program.cs                 # Application entry point
│
└── CommunityCar.Tests/            # Test project
    ├── Unit/                      # Unit tests
    └── Integration/               # Integration tests
```

### Backend Conventions

- **Entities**: Inherit from `BaseEntity` (includes Id, audit fields, soft delete)
- **Controllers**: Organized by feature domain, inherit from appropriate base controller
- **Services**: Interface in Application layer, implementation in Infrastructure layer
- **CQRS**: Commands/Queries in Application/Features/, handlers co-located
- **Swagger**: Organized into 9 API groups (identity, dashboard, community, marketplace, services, podcasts, videos, pages, mobile)

## Frontend Structure (ClientApp/)

Angular multi-project workspace with shared configuration:

```
ClientApp/
├── projects/
│   ├── main/                      # Main user-facing application
│   │   └── src/
│   │       ├── app/
│   │       │   ├── core/          # Singleton services, guards, interceptors
│   │       │   ├── features/      # Feature modules (lazy-loaded)
│   │       │   │   ├── auth/
│   │       │   │   ├── profile/
│   │       │   │   ├── community/
│   │       │   │   └── ...
│   │       │   ├── shared/        # Shared components, directives, pipes
│   │       │   └── layout/        # Layout components
│   │       ├── assets/            # Static assets
│   │       ├── environments/      # Environment configs
│   │       └── styles.scss        # Global styles
│   │
│   └── admin/                     # Admin portal application
│       └── src/
│           ├── app/
│           │   ├── core/
│           │   ├── features/      # Admin-specific features
│           │   │   ├── dashboard/
│           │   │   ├── users/
│           │   │   └── ...
│           │   └── shared/
│           └── ...
│
├── angular.json                   # Angular workspace config
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # TailwindCSS config
└── tsconfig.json                  # TypeScript config
```

### Frontend Conventions

- **Routing**: Lazy-loaded feature modules
- **State**: Services with RxJS for state management
- **Styling**: TailwindCSS utility classes
- **Components**: Smart/container vs presentational pattern
- **Ports**: Main app on 4200, Admin on 4201

## Mobile Structure (Mobile/)

Flutter app with standard architecture:

```
Mobile/
└── lib/
    ├── config/                    # App configuration
    │   └── router.dart            # Route definitions
    ├── models/                    # Data models
    │   └── user.dart
    ├── providers/                 # State management (Provider)
    │   └── auth_provider.dart
    ├── screens/                   # UI screens
    │   ├── home_screen.dart
    │   ├── login_screen.dart
    │   ├── profile_screen.dart
    │   └── register_screen.dart
    ├── services/                  # API and business logic
    │   └── api_service.dart
    └── main.dart                  # App entry point
```

### Mobile Conventions

- **State Management**: Provider pattern
- **Routing**: go_router for declarative routing
- **API**: Centralized API service
- **Storage**: flutter_secure_storage for sensitive data, shared_preferences for settings

## AI Agent Structure (AiAgent/)

FastAPI service with modular organization:

```
AiAgent/
├── agents/                        # AI agent implementations
│   ├── assistant.py
│   └── __init__.py
├── routers/                       # FastAPI route handlers
├── services/                      # Business logic services
├── tests/                         # Pytest tests
│   ├── test_assistant.py
│   └── __init__.py
├── config.py                      # Configuration
├── main.py                        # FastAPI app entry point
├── requirements.txt               # Python dependencies
└── .env.example                   # Environment variables template
```

### AI Agent Conventions

- **Framework**: FastAPI with async/await
- **Routes**: Organized by feature in routers/
- **Testing**: pytest for unit tests
- **Config**: Environment variables via .env

## DevOps Structure (.devops/)

```
.devops/
├── k8s/                           # Kubernetes manifests
│   ├── namespace.yaml
│   └── api-deployment.yaml
├── Dockerfile.api                 # .NET API container
├── Dockerfile.web                 # Angular web container
├── Dockerfile.ai                  # Python AI container
├── docker-compose.yml             # Local development orchestration
└── nginx.conf                     # Reverse proxy config
```

## Documentation (docs/)

```
docs/
├── api.md                         # API reference
├── architecture.md                # System architecture
├── setup.md                       # Development setup guide
├── seeding-guide.md               # Database seeding guide
├── google-oauth-setup.md          # OAuth configuration
└── ...                            # Feature-specific docs
```

## Key Patterns

- **Backend**: Clean Architecture with CQRS, Repository pattern, and dependency injection
- **Frontend**: Feature-based modules with lazy loading
- **Mobile**: Provider for state, layered architecture (screens → providers → services)
- **Naming**: PascalCase for C#, camelCase for TypeScript/Dart, snake_case for Python
- **Organization**: Group by feature/domain, not by technical layer
