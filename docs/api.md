# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.fullycommunity.com/api
```

## Authentication
JWT Bearer token required for protected endpoints.

## Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get current user (auth required)
- `PUT /auth/me` - Update current user (auth required)

### AI Agent
- `POST /api/agents/chat` - Chat with AI assistant
- `GET /api/agents/insights/{userId}` - Get user insights
