 CommunityCar Admin Panel

## Project Structure

```
src/app/
├── core/
│   ├── guards/              # Route guards
│   │   ├── auth.guard.ts    # Authentication guard
│   │   ├── admin.guard.ts   # Admin role guard
│   │   ├── role.guard.ts    # Permission-based guard
│   │   └── index.ts         # Central export
│   │
│   ├── interceptors/        # HTTP interceptors
│   │   ├── auth.interceptor.ts     # JWT token injection
│   │   ├── error.interceptor.ts    # Global error handling
│   │   ├── loading.interceptor.ts  # Loading state management
│   │   └── index.ts         # Central export
│   │
│   ├── interfaces/          # TypeScript interfaces
│   │   ├── base/            # Base entity and API response interfaces
│   │   ├── common/          # Common enums, pagination, constants
│   │   ├── admin/           # Admin, users, moderation, reports, roles, settings
│   │   ├── auth/            # Authentication interfaces
│   │   ├── dashboard/       # Dashboard interfaces
│   │   ├── notifications/   # Notification interfaces
│   │   ├── content/         # Content management interfaces
│   │   │   ├── community/   # Community content (QA, posts, pages, groups, events)
│   │   │   ├── podcasts/    # Podcast interfaces
│   │   │   └── videos/      # Video interfaces
│   │   ├── marketplace/     # Marketplace interfaces
│   │   │   ├── products/    # Product management
│   │   │   └── orders/      # Order management
│   │   ├── services/        # Service booking interfaces
│   │   └── index.ts         # Central export
│   │
│   ├── services/            # Angular services
│   │   ├── common/          # Common utility services
│   │   │   ├── loading.service.ts  # Loading state management
│   │   │   └── toast.service.ts    # Toast notifications
│   │   ├── admin/           # Admin services (users, moderation, reports, roles, settings)
│   │   ├── auth/            # Authentication service
│   │   ├── dashboard/       # Dashboard service
│   │   ├── notifications/   # Notification service
│   │   ├── content/         # Content management services
│   │   │   ├── community/   # Community services
│   │   │   ├── podcasts/    # Podcast services
│   │   │   └── videos/      # Video services
│   │   ├── marketplace/     # Marketplace services
│   │   │   ├── products/    # Product services
│   │   │   └── orders/      # Order services
│   │   ├── services/        # Service booking services
│   │   └── index.ts         # Central export
│   │
│   └── utils/               # Utility functions
│       ├── date.utils.ts    # Date formatting and manipulation
│       ├── string.utils.ts  # String utilities
│       └── index.ts         # Central export
│
├── features/                # Feature modules
│   └── admin/
│       ├── content/         # Content management features
│       ├── marketplace/     # Marketplace features
│       ├── services/        # Service management features
│       ├── users/           # User management
│       ├── moderation/      # Moderation tools
│       └── dashboard/       # Dashboard
│
└── shared/                  # Shared components, directives, pipes

```

## Architecture Principles

### 1. Separation of Concerns
- **Interfaces**: Define data structures and contracts
- **Services**: Handle business logic and API communication
- **Components**: Handle UI and user interactions

### 2. Base & Common
- **base/**: Foundational interfaces (BaseEntity, ApiResponse, etc.)
- **common/**: Shared types, enums, and constants

### 3. Domain Organization
- Content Management (Community, Media)
- Marketplace (Products, Orders)
- Services (Bookings, Providers)
- Admin (Users, Moderation, Reports)

### 4. Naming Conventions
- Interfaces: `{Domain}{Purpose}.interface.ts`
- Services: `{domain}-admin.service.ts`
- Components: `{feature}-{purpose}.component.ts`

## Key Features

### Content Management
- Q&A Administration
- Posts, Pages, Groups, Events
- Videos & Podcasts
- Moderation Tools

### Marketplace
- Product Management
- Order Processing
- Inventory Control
- Category & Brand Management

### Services
- Service Listings
- Booking Management
- Provider Management
- Category Management

### Admin Tools
- User Management
- Role & Permissions
- Analytics & Reports
- System Settings

## Usage Examples

### Importing Interfaces
```typescript
import { 
  Product, 
  ProductsListResponse,
  ApiResponse 
} from '@core/interfaces';
```

### Importing Services
```typescript
import { 
  ProductsAdminService,
  OrdersAdminService,
  LoadingService,
  ToastService
} from '@core/services';
```

### Using Services with inject()
```typescript
import { inject } from '@angular/core';

export class MyComponent {
  private productsService = inject(ProductsAdminService);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.productsService.getProducts(1, 20).subscribe({
      next: (response) => {
        this.products = response.items;
        this.toastService.success('Products loaded successfully');
      },
      error: (error) => {
        this.toastService.error(error.message);
      }
    });
  }
}
```

### Using Guards
```typescript
import { Routes } from '@angular/router';
import { authGuard, adminGuard, roleGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { requiredPermissions: ['users.manage'] }
      }
    ]
  }
];
```

### Using Utilities
```typescript
import { DateUtils, StringUtils } from '@core/utils';

// Date formatting
const formatted = DateUtils.formatDate(new Date(), 'relative'); // "2h ago"

// String utilities
const slug = StringUtils.slugify('My Product Name'); // "my-product-name"
const initials = StringUtils.getInitials('John Doe'); // "JD"
```

## Development Guidelines

1. **Always use interfaces** for type safety
2. **Use inject()** instead of constructor injection
3. **Follow the folder structure** for consistency
4. **Export from index.ts** for clean imports
5. **Use base interfaces** to avoid duplication
6. **Document complex logic** with comments
7. **Use Tailwind CSS** - no SCSS files
8. **Use modern Angular syntax** - @if, @for instead of *ngIf, *ngFor
9. **Mobile-first responsive design** with Tailwind utilities
10. **Leverage utility functions** for common operations

## HTTP Interceptors

The application uses three HTTP interceptors (configured in `main.ts`):

### 1. Auth Interceptor
- Automatically injects JWT token into all API requests
- Adds `Authorization: Bearer {token}` header

### 2. Error Interceptor
- Global error handling for all HTTP requests
- Handles common HTTP status codes (401, 403, 404, 500, etc.)
- Automatically redirects on authentication failures
- Logs errors for debugging

### 3. Loading Interceptor
- Manages global loading state
- Shows/hides loading indicator automatically
- Skip loading for specific requests with `X-Skip-Loading` header

```typescript
// Skip loading indicator for a specific request
this.http.get(url, {
  headers: { 'X-Skip-Loading': 'true' }
});
```

## Common Services

### LoadingService
Manages global loading state:
```typescript
const loadingService = inject(LoadingService);

// Manual control
loadingService.show();
loadingService.hide();

// Check loading state
if (loadingService.isLoading()) {
  // Show loading UI
}
```

### ToastService
Display toast notifications:
```typescript
const toastService = inject(ToastService);

toastService.success('Operation completed');
toastService.error('Something went wrong');
toastService.warning('Please review your input');
toastService.info('New update available');
```

## API Response Pattern

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}
```

## Pagination Pattern

All paginated endpoints return:

```typescript
interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```
