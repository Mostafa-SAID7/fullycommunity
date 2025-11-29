# Architecture Overview

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Angular   │     │   Flutter   │     │  External   │
│   Web App   │     │  Mobile App │     │   Clients   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │   API GW    │
                    │   (nginx)   │
                    └──────┬──────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
│  ASP.NET    │     │   AI Agent  │     │   SignalR   │
│  Core API   │     │   (Python)  │     │   Hub       │
└──────┬──────┘     └──────┬──────┘     └─────────────┘
       │                   │
       └───────────────────┘
                │
         ┌──────▼──────┐
         │  Database   │
         │  (SQL/PG)   │
         └─────────────┘
```

## Layers

### Presentation Layer
- Angular 19 SPA
- Flutter Mobile App

### Application Layer
- ASP.NET Core 9 Web API
- Python AI Agent Service

### Domain Layer
- Business Logic
- Domain Entities
- Domain Services

### Infrastructure Layer
- Data Access (EF Core)
- External Services
- Caching
