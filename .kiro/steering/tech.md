# Technology Stack

## Backend (.NET)

- **Framework**: ASP.NET Core 9.0
- **Language**: C# with nullable reference types enabled
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, API layers)
- **ORM**: Entity Framework Core 9.0
- **Database**: SQL Server (SQLite for development)
- **Authentication**: ASP.NET Identity with JWT Bearer tokens
- **API Documentation**: Swashbuckle (Swagger/OpenAPI)
- **Patterns**: CQRS with MediatR, Repository pattern, Unit of Work
- **Validation**: FluentValidation
- **Real-time**: SignalR for chat and notifications

### Key NuGet Packages
- MediatR (CQRS pattern)
- FluentValidation (validation)
- AspNetCoreRateLimit (rate limiting)
- Asp.Versioning.Mvc (API versioning)

## Frontend (Angular)

- **Framework**: Angular 19
- **Language**: TypeScript 5.6
- **Styling**: TailwindCSS 3.4
- **Icons**: HugeIcons
- **Real-time**: @microsoft/signalr
- **Projects**: Multi-project workspace (main app + admin portal)

## Mobile (Flutter)

- **Framework**: Flutter 3.24+
- **Language**: Dart 3.2+
- **State Management**: Provider
- **Routing**: go_router
- **Storage**: shared_preferences, flutter_secure_storage
- **HTTP**: http package

## AI Agent (Python)

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI**: HuggingFace models
- **Server**: Uvicorn (ASGI)

## DevOps

- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes (k8s manifests in .devops/k8s/)
- **Reverse Proxy**: nginx
- **CI/CD**: GitHub Actions (separate workflows per component)
- **Compose**: docker-compose.yml for local development

## Common Commands

### Backend (.NET)
```bash
# Restore dependencies
cd src
dotnet restore

# Build solution
dotnet build

# Run API (with hot reload)
dotnet run --project CommunityCar.API
dotnet watch --project CommunityCar.API

# Run tests
dotnet test
dotnet test --collect:"XPlat Code Coverage"

# Database migrations
dotnet ef migrations add MigrationName --project CommunityCar.Infrastructure --startup-project CommunityCar.API
dotnet ef database update --project CommunityCar.Infrastructure --startup-project CommunityCar.API

# API runs on http://localhost:5000
# Swagger UI at http://localhost:5000
```

### Frontend (Angular)
```bash
cd ClientApp

# Install dependencies
npm install

# Serve main app (port 4200)
npm run start:main
ng serve community-car-main

# Serve admin app (port 4201)
npm run start:admin
ng serve community-car-admin

# Build both apps
npm run build

# Build individual apps
npm run build:main
npm run build:admin

# Run tests
npm test

# Lint
npm run lint
```

### Mobile (Flutter)
```bash
cd Mobile

# Get dependencies
flutter pub get

# Run app (requires emulator or device)
flutter run

# Build APK
flutter build apk

# Build iOS
flutter build ios

# Run tests
flutter test

# Analyze code
flutter analyze
```

### AI Agent (Python)
```bash
cd AiAgent

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server (with hot reload)
uvicorn main:app --reload

# Run tests
pytest

# API runs on http://localhost:8000
# Docs at http://localhost:8000/docs
```

### Docker
```bash
# Build and run all services
cd .devops
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build api
docker-compose up -d api
```

## Code Style

- **Indentation**: 4 spaces for C# and Python, 2 spaces for TypeScript/JavaScript/YAML/JSON
- **Line Endings**: CRLF (Windows)
- **Charset**: UTF-8
- **Trailing Whitespace**: Trimmed (except Markdown)
- **Final Newline**: Required
- **C# Nullable**: Enabled project-wide
- **C# Implicit Usings**: Enabled
