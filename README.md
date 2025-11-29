# Community Car Platform

A full-stack community car sharing/management platform.

## Project Structure

```
├── ClientApp/          # Angular 19 Frontend
├── src/                # ASP.NET Core 9 Backend
├── AiAgent/            # Python ML & HuggingFace Agents
├── Mobile/             # Flutter Mobile App
├── docs/               # Documentation
├── .devops/            # DevOps configurations
├── .github/            # GitHub workflows & templates
```

## Tech Stack

- **Frontend**: Angular 19
- **Backend**: ASP.NET Core 9
- **AI/ML**: Python, HuggingFace Transformers
- **Mobile**: Flutter
- **Database**: SQL Server / PostgreSQL

## Getting Started

### Prerequisites

- Node.js 20+
- .NET 9 SDK
- Python 3.11+
- Flutter 3.x
- Docker (optional)

### Quick Start

```bash
# Backend
cd src
dotnet restore
dotnet run --project CommunityCar.API

# Frontend
cd ClientApp
npm install
ng serve

# AI Agent
cd AiAgent
pip install -r requirements.txt
uvicorn main:app --reload

# Mobile
cd Mobile
flutter pub get
flutter run
```

## License

MIT License
