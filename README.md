<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Fully%20Community&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=fff" width="100%"/>

# 🌐 Fully Community Platform

<p align="center">
  <strong>A Modern Full-Stack Community Platform with AI-Powered Features</strong>
</p>

<p align="center">
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-security">Security</a>
</p>

### 🔄 CI/CD Status

<p align="center">
  <a href="https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/backend/ci.yml">
    <img src="https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/backend/ci.yml/badge.svg" alt="Backend CI"/>
  </a>
  <a href="https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/frontend/ci.yml">
    <img src="https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/frontend/ci.yml/badge.svg" alt="Frontend CI"/>
  </a>
  <a href="https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/mobile/ci.yml">
    <img src="https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/mobile/ci.yml/badge.svg" alt="Mobile CI"/>
  </a>
  <a href="https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/ai-agent/ci.yml">
    <img src="https://github.com/Mostafa-SAID7/fullycommunity/actions/workflows/ai-agent/ci.yml/badge.svg" alt="AI Agent CI"/>
  </a>
</p>

### 🛠️ Tech Stack

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"/>
  </a>
  <a href="https://dotnet.microsoft.com/">
    <img src="https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET"/>
  </a>
  <a href="https://angular.io/">
    <img src="https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"/>
  </a>
  <a href="https://flutter.dev/">
    <img src="https://img.shields.io/badge/Flutter-3.24-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter"/>
  </a>
  <a href="https://python.org/">
    <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  </a>
</p>

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
Secure JWT-based authentication with ASP.NET Identity, featuring token rotation, account lockout protection, and email confirmation.

### 🤖 AI-Powered Assistant
HuggingFace-powered community assistant providing intelligent responses and automated support.

### 🐳 Cloud-Native Architecture
Fully containerized with Docker and Kubernetes support for seamless deployment and scaling.

</td>
<td width="50%">

### 👤 User Profiles
Complete profile management system across all platforms with real-time synchronization.

### 📱 Cross-Platform Experience
Native experiences on Web (Angular 19) and Mobile (Flutter for iOS/Android).

### 🚀 Modern CI/CD Pipeline
Automated testing, building, and deployment with GitHub Actions for all components.

</td>
</tr>
</table>

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

> [!IMPORTANT]
> Before you begin, ensure you have the required tools installed. The platform consists of multiple components that can be run independently or together using Docker.

### Prerequisites

<table>
<tr>
<th>🛠️ Tool</th>
<th>📦 Version</th>
<th>⬇️ Download</th>
<th>📝 Purpose</th>
</tr>
<tr>
<td><strong>Node.js</strong></td>
<td>20+</td>
<td><a href="https://nodejs.org/">nodejs.org</a></td>
<td>Frontend development</td>
</tr>
<tr>
<td><strong>.NET SDK</strong></td>
<td>9.0</td>
<td><a href="https://dotnet.microsoft.com/">dotnet.microsoft.com</a></td>
<td>Backend API</td>
</tr>
<tr>
<td><strong>Python</strong></td>
<td>3.11+</td>
<td><a href="https://python.org/">python.org</a></td>
<td>AI Agent service</td>
</tr>
<tr>
<td><strong>Flutter</strong></td>
<td>3.24+</td>
<td><a href="https://flutter.dev/">flutter.dev</a></td>
<td>Mobile application</td>
</tr>
<tr>
<td><strong>Docker</strong></td>
<td>Latest</td>
<td><a href="https://docker.com/">docker.com</a></td>
<td>Containerization</td>
</tr>
</table>

> [!TIP]
> **Quick Setup**: If you have Docker installed, you can skip individual tool installations and run everything with `docker-compose up -d`!
| .NET SDK | 9.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/) |
| Python | 3.11+ | [python.org](https://python.org/) |
| Flutter | 3.24+ | [flutter.dev](https://flutter.dev/) |
| Docker | Latest | [docker.com](https://docker.com/) |

### Quick Start

<details open>
<summary><strong>🔷 Backend (.NET)</strong></summary>

```bash
cd src
dotnet restore
dotnet run --project CommunityCar.API
```

**Endpoints:**
- 🌐 API: `http://localhost:5000`
- 📚 Swagger: `http://localhost:5000/swagger`

</details>

<details>
<summary><strong>🧪 Run Tests</strong></summary>

```bash
cd src
dotnet test --verbosity normal
```

> [!TIP]
> Use `--collect:"XPlat Code Coverage"` to generate coverage reports.

</details>

<details>
<summary><strong>🌐 Frontend (Angular)</strong></summary>

```bash
cd ClientApp
npm install
ng serve
```

**Access:** `http://localhost:4200`

</details>

<details>
<summary><strong>🤖 AI Agent (Python)</strong></summary>

```bash
cd AiAgent
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

**Endpoints:**
- 🌐 API: `http://localhost:8000`
- 📚 Docs: `http://localhost:8000/docs`

</details>

<details>
<summary><strong>📱 Mobile (Flutter)</strong></summary>

```bash
cd Mobile
flutter pub get
flutter run
```

> [!NOTE]
> Ensure you have an emulator running or a physical device connected.

</details>

<details>
<summary><strong>🐳 Docker (All Services)</strong></summary>

```bash
cd .devops
docker-compose up -d
```

> [!TIP]
> This is the easiest way to run all services together. Perfect for testing the complete platform!

</details>

---

## 📖 Documentation

<table>
<tr>
<td width="33%" align="center">

### 📚 [API Reference](docs/api.md)
**REST API Endpoints**

Complete API documentation with request/response examples

</td>
<td width="33%" align="center">

### 🏗️ [Architecture](docs/architecture.md)
**System Design**

Detailed architecture diagrams and design decisions

</td>
<td width="33%" align="center">

### ⚙️ [Setup Guide](docs/setup.md)
**Development Setup**

Step-by-step development environment setup

</td>
</tr>
<tr>
<td width="50%" align="center">

### 🤝 [Contributing](CONTRIBUTING.md)
**Contribution Guidelines**

How to contribute to the project

</td>
<td width="50%" align="center">

### 🔒 [Security](SECURITY.md)
**Security Policy**

Security practices and vulnerability reporting

</td>
</tr>
</table>
| [Contributing](CONTRIBUTING.md) | Contribution guidelines |
| [Security](SECURITY.md) | Security policy |

---

## 🤝 Contributing

<div align="center">

**We welcome contributions from developers of all skill levels!** 🎉

Whether you're fixing bugs, adding features, or improving documentation,
your contributions make this project better for everyone.

</div>

### Quick Contribution Guide

```bash
# 1️⃣ Fork & clone the repo
git clone https://github.com/YOUR_USERNAME/fullycommunity.git
cd fullycommunity

# 2️⃣ Create a feature branch
git checkout -b feature/amazing-feature

# 3️⃣ Make your changes & commit (follow conventional commits)
git commit -m "feat: add amazing feature"

# 4️⃣ Push & create a PR
git push origin feature/amazing-feature
```

> [!NOTE]
> Please read our [Contributing Guide](CONTRIBUTING.md) for detailed guidelines on code style, commit messages, and the PR process.

---

## 🔒 Security

> [!CAUTION]
> **Found a security vulnerability?** Please DO NOT open a public issue.

**Report security issues privately:**
- 📧 Email: `security@fullycommunity.com`
- 📋 See our [Security Policy](SECURITY.md) for detailed reporting guidelines

We take security seriously and will respond promptly to all reports.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

<div align="center">

---

### 💖 Support the Project

<table>
<tr>
<td align="center" width="33%">

⭐ **Star us on GitHub**

It motivates us a lot!

</td>
<td align="center" width="33%">

🐛 **Report Issues**

Help us improve!

</td>
<td align="center" width="33%">

🤝 **Contribute**

Join our community!

</td>
</tr>
</table>

---

**Made with ❤️ by the Fully Community Team**

<sub>© 2025 Community Car Platform. All rights reserved.</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
