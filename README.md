<div align="center">

# 🌐 Fully Community Platform

[![Backend CI](https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/backend/ci.yml/badge.svg)](https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/backend/ci.yml)
[![Frontend CI](https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/frontend/ci.yml/badge.svg)](https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/frontend/ci.yml)
[![Mobile CI](https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/mobile/ci.yml/badge.svg)](https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/mobile/ci.yml)
[![AI Agent CI](https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/ai-agent/ci.yml/badge.svg)](https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/ai-agent/ci.yml)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)](https://angular.io/)
[![Flutter](https://img.shields.io/badge/Flutter-3.24-02569B?logo=flutter)](https://flutter.dev/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://python.org/)

**A modern full-stack community platform with AI-powered features**

[Getting Started](#-getting-started) •
[Documentation](#-documentation) •
[Contributing](#-contributing) •
[Security](#-security)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure JWT-based auth with ASP.NET Identity |
| 👤 **User Profiles** | Complete profile management across all platforms |
| 🤖 **AI Assistant** | HuggingFace-powered community assistant |
| 📱 **Cross-Platform** | Web (Angular) + Mobile (Flutter iOS/Android) |
| 🚀 **CI/CD** | Automated testing, building, and deployment |
| 🐳 **Containerized** | Docker & Kubernetes ready |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
├──────────────────┬──────────────────┬───────────────────────────┤
│   🌐 Angular 19   │   📱 Flutter     │      🔌 External APIs     │
│   (ClientApp/)   │   (Mobile/)      │                           │
└────────┬─────────┴────────┬─────────┴─────────────┬─────────────┘
         │                  │                       │
         └──────────────────┼───────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   🔀 API GW    │
                    │   (nginx)     │
                    └───────┬───────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
   ┌─────▼─────┐     ┌──────▼──────┐    ┌─────▼─────┐
   │ 🔷 .NET 9  │     │  🐍 Python   │    │ 📡 SignalR │
   │   API     │     │  AI Agent   │    │   Hub     │
   │  (src/)   │     │ (AiAgent/)  │    │           │
   └─────┬─────┘     └──────┬──────┘    └───────────┘
         │                  │
         └────────┬─────────┘
                  │
           ┌──────▼──────┐
           │  🗄️ Database │
           │  SQL Server │
           └─────────────┘
```

---

## 📁 Project Structure

```
fullycommunity/
├── 📂 ClientApp/              # Angular 19 Frontend
│   └── src/
│       ├── app/
│       │   ├── core/          # Guards, interceptors, services
│       │   ├── features/      # Feature modules (auth, profile)
│       │   └── shared/        # Shared components
│       └── environments/
│
├── 📂 src/                    # ASP.NET Core 9 Backend
│   ├── CommunityCar.API/      # Web API layer
│   ├── CommunityCar.Application/  # Business logic
│   ├── CommunityCar.Domain/   # Entities & interfaces
│   ├── CommunityCar.Infrastructure/  # Data access
│   └── CommunityCar.Tests/    # Unit & integration tests
│
├── 📂 AiAgent/                # Python AI Service
│   ├── agents/                # AI assistants
│   ├── routers/               # FastAPI routes
│   ├── services/              # Business services
│   └── tests/                 # Pytest tests
│
├── 📂 Mobile/                 # Flutter Mobile App
│   └── lib/
│       ├── config/            # Router, theme
│       ├── models/            # Data models
│       ├── providers/         # State management
│       ├── screens/           # UI screens
│       └── services/          # API services
│
├── 📂 .devops/                # DevOps Configurations
│   ├── k8s/                   # Kubernetes manifests
│   ├── Dockerfile.*           # Docker images
│   └── docker-compose.yml
│
├── 📂 .github/                # GitHub Configurations
│   └── workflows/
│       ├── backend/           # .NET CI/CD
│       ├── frontend/          # Angular CI/CD
│       ├── mobile/            # Flutter CI/CD
│       ├── ai-agent/          # Python CI/CD
│       ├── infrastructure/    # Docker, Terraform
│       └── shared/            # CodeQL, Release, PR automation
│
└── 📂 docs/                   # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| .NET SDK | 9.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/) |
| Python | 3.11+ | [python.org](https://python.org/) |
| Flutter | 3.24+ | [flutter.dev](https://flutter.dev/) |
| Docker | Latest | [docker.com](https://docker.com/) |

### Quick Start

#### 🔷 Backend (.NET)
```bash
cd src
dotnet restore
dotnet run --project CommunityCar.API
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

#### 🧪 Run Tests
```bash
cd src
dotnet test --verbosity normal
```

#### 🌐 Frontend (Angular)
```bash
cd ClientApp
npm install
ng serve
# App: http://localhost:4200
```

#### 🤖 AI Agent (Python)
```bash
cd AiAgent
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

#### 📱 Mobile (Flutter)
```bash
cd Mobile
flutter pub get
flutter run
```

#### 🐳 Docker (All Services)
```bash
cd .devops
docker-compose up -d
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [API Reference](docs/api.md) | REST API endpoints |
| [Architecture](docs/architecture.md) | System design |
| [Setup Guide](docs/setup.md) | Development setup |
| [Contributing](CONTRIBUTING.md) | Contribution guidelines |
| [Security](SECURITY.md) | Security policy |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Fork & clone the repo
git clone https://github.com/YOUR_USERNAME/fullycommunity.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes & commit
git commit -m "feat: add amazing feature"

# Push & create a PR
git push origin feature/amazing-feature
```

---

## 🔒 Security

Found a security vulnerability? Please see our [Security Policy](SECURITY.md) for responsible disclosure.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the Fully Community Team**

⭐ Star us on GitHub — it motivates us a lot!

</div>
