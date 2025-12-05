# Enhanced Error Pages with Microsoft Fluent Design

This directory contains enhanced error pages built with Microsoft Fluent Design principles and prepared for Lottie animations.

## Available Error Pages

- **400 - Bad Request** (`/errors/400`)
- **401 - Unauthorized** (`/errors/401`) 
- **403 - Forbidden** (`/errors/403`)
- **404 - Not Found** (`/errors/404`)
- **500 - Server Error** (`/errors/500`)
- **Maintenance** (`/errors/maintenance`)
- **Network Error** (`/errors/network-error`)

## Features

### Microsoft Fluent Design
- Clean, modern card-based layouts
- Subtle gradients and shadows
- Consistent typography and spacing
- Dark mode support
- Responsive design

### Interactive Elements
- Smooth hover transitions
- Animated icons (CSS animations as placeholders)
- Action buttons with proper states
- Contextual help and navigation

### Accessibility
- Proper semantic HTML
- ARIA labels for screen readers
- High contrast colors
- Keyboard navigation support

## Adding Lottie Animations

To enhance these error pages with Lottie animations:

### 1. Install Lottie Dependencies

```bash
npm install lottie-web ngx-lottie
```

### 2. Update Angular Configuration

Add to `angular.json`:

```json
{
  "projects": {
    "community-car-main": {
      "architect": {
        "build": {
          "options": {
            "scripts": [
              "node_modules/lottie-web/build/player/lottie.min.js"
            ]
          }
        }
      }
    }
  }
}
```

### 3. Import Lottie Module

In your app module or component:

```typescript
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    LottieModule.forRoot({ player: playerFactory })
  ]
})
```

### 4. Replace Animation Placeholders

Replace the emoji placeholders with Lottie components:

```html
<!-- Replace this -->
<div class="text-6xl animate-bounce">🔍</div>

<!-- With this -->
<ng-lottie 
  [options]="lottieOptions" 
  [width]="128" 
  [height]="128">
</ng-lottie>
```

### 5. Component Implementation

```typescript
export class NotFoundComponent {
  lottieOptions = {
    path: '/assets/animations/404-not-found.json',
    loop: true,
    autoplay: true
  };
}
```

## Recommended Lottie Animations

### Animation Sources
- [LottieFiles](https://lottiefiles.com/) - Free and premium animations
- [Lordicon](https://lordicon.com/) - Premium animated icons
- [Iconscout](https://iconscout.com/lottie-animations) - Curated collection

### Suggested Animations by Error Type

- **404 Not Found**: Search, magnifying glass, empty state
- **500 Server Error**: Warning, alert, broken server
- **401 Unauthorized**: Lock, key, security shield  
- **403 Forbidden**: Stop sign, blocked access, warning
- **400 Bad Request**: Error, warning triangle, invalid input
- **Maintenance**: Tools, gears, construction
- **Network Error**: Disconnected, no signal, network issues

## Customization

### Color Schemes
Each error page uses semantic colors from the Tailwind config:
- Primary: Blue (`#0066FF`)
- Error: Red (`#EF4444`) 
- Warning: Amber (`#F59E0B`)
- Success: Emerald (`#10B981`)

### Gradients
Background gradients are contextual:
- 404: Purple to Blue (search/discovery theme)
- 500: Red to Orange (error/alert theme)
- 401: Indigo to Purple (security theme)
- 403: Yellow to Orange (warning theme)
- Maintenance: Blue to Indigo (service theme)

### Responsive Breakpoints
- Mobile: Full width with padding
- Tablet: Centered card layout
- Desktop: Optimized spacing and typography

## Usage in Routes

The error pages are lazy-loaded through the routing module:

```typescript
{
  path: 'errors',
  loadChildren: () => import('./features/errors/error-routing.module').then(m => m.ErrorRoutingModule)
}
```

## Integration with Error Handling

Use with Angular's global error handler:

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    if (error.status === 404) {
      this.router.navigate(['/errors/404']);
    } else if (error.status === 500) {
      this.router.navigate(['/errors/500']);
    }
    // ... other error handling
  }
}
```