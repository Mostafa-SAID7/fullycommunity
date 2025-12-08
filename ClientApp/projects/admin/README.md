# CommunityCar Admin Panel

## Project Structure

```
src/app/
├── core/
│   ├── interfaces/           # TypeScript interfaces
│   │   ├── base/            # Base entity and API response interfaces
│   │   ├── common/          # Common enums, pagination, constants
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
│   └── services/            # Angular services
│       ├── content/         # Content management services
│       │   ├── community/   # Community services
│       │   ├── podcasts/    # Podcast services
│       │   └── videos/      # Video services
│       ├── marketplace/     # Marketplace services
│       │   ├── products/    # Product services
│       │   └── orders/      # Order services
│       ├── services/        # Service booking services
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
  OrdersAdminService 
} from '@core/services';
```

### Using Services
```typescript
constructor(private productsService: ProductsAdminService) {}

ngOnInit() {
  this.productsService.getProducts(1, 20).subscribe(response => {
    this.products = response.items;
  });
}
```

## Development Guidelines

1. **Always use interfaces** for type safety
2. **Use inject()** instead of constructor injection
3. **Follow the folder structure** for consistency
4. **Export from index.ts** for clean imports
5. **Use base interfaces** to avoid duplication
6. **Document complex logic** with comments

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
