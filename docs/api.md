# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.communitycar.com/api
```

## Authentication
JWT Bearer token required for protected endpoints.

## Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

### Cars
- `GET /cars` - List all cars
- `GET /cars/{id}` - Get car details
- `POST /cars` - Create car (auth required)
- `PUT /cars/{id}` - Update car (auth required)
- `DELETE /cars/{id}` - Delete car (auth required)

### Bookings
- `GET /bookings` - List user bookings
- `POST /bookings` - Create booking
- `PUT /bookings/{id}` - Update booking
- `DELETE /bookings/{id}` - Cancel booking

### AI
- `POST /ai/recommend` - Get car recommendations
- `POST /ai/predict-price` - Predict car price
