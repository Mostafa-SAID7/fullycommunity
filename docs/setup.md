# Development Setup Guide

## Prerequisites

- Node.js 20+
- .NET 9 SDK
- Python 3.11+
- Flutter 3.x
- Docker Desktop
- SQL Server or PostgreSQL

## Environment Setup

### Backend (.NET)
```bash
cd src
dotnet restore
dotnet ef database update --project CommunityCar.Infrastructure
dotnet run --project CommunityCar.API
```

### Frontend (Angular)
```bash
cd ClientApp
npm install
ng serve
```

### AI Agent (Python)
```bash
cd AiAgent
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Mobile (Flutter)
```bash
cd Mobile
flutter pub get
flutter run
```

## Docker Setup
```bash
cd .devops
docker-compose up -d
```

## Environment Variables

Create `.env` files in respective directories:

### Backend
```
ConnectionStrings__DefaultConnection=your_connection_string
Jwt__Secret=your_jwt_secret
```

### AI Agent
```
HUGGINGFACE_TOKEN=your_hf_token
```
