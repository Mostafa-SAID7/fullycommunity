# Fully Community Platform

A full-stack community platform with authentication and AI assistant.

## Project Structure

```
├── ClientApp/          # Angular 19 Frontend
├── src/                # ASP.NET Core 9 Backend
│   ├── CommunityCar.API/
│   ├── CommunityCar.Application/
│   ├── CommunityCar.Domain/
│   ├── CommunityCar.Infrastructure/
│   └── CommunityCar.Tests/
├── AiAgent/            # Python AI Assistant
├── Mobile/             # Flutter Mobile App
├── docs/               # Documentation
├── .devops/            # DevOps configurations
├── .github/            # GitHub workflows & templates
```

## Tech Stack

- **Frontend**: Angular 19
- **Backend**: ASP.NET Core 9 with Identity
- **AI**: Python, HuggingFace Transformers
- **Mobile**: Flutter
- **Database**: SQL Server / PostgreSQL

## Features

- User authentication (register, login, JWT)
- Profile management
- AI-powered community assistant
- Cross-platform mobile app

## Getting Started

```bash
# Backend
cd src && dotnet restore && dotnet run --project CommunityCar.API

# Run Tests
cd src && dotnet test

# Frontend
cd ClientApp && npm install && ng serve

# AI Agent
cd AiAgent && pip install -r requirements.txt && uvicorn main:app --reload

# Mobile
cd Mobile && flutter pub get && flutter run
```

## License

MIT License
