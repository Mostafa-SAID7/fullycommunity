# Chart Components

Reusable chart components for the CommunityCar Admin Portal.

## Components

### 1. StatCardComponent
Display key metrics with optional trend indicators.

**Usage:**
```typescript
import { StatCardComponent, StatCardConfig } from './charts';

statConfig: StatCardConfig = {
  title: 'Total Users',
  value: '12,543',
  icon: '👥',
  color: 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'info'
  trend: {
    value: 12.5,
    isPositive: true
  }
};
```

```html
<app-stat-card [config]="statConfig"></app-stat-card>
```

### 2. PieChartComponent
Display data distribution in a pie or doughnut chart.

**Usage:**
```typescript
import { PieChartComponent, PieChartConfig } from './charts';

pieConfig: PieChartConfig = {
  labels: ['Category A', 'Category B', 'Category C'],
  data: [300, 500, 200],
  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
  height: 300,
  doughnut: false // Set to true for doughnut chart
};
```

```html
<app-pie-chart [config]="pieConfig"></app-pie-chart>
```

### 3. BarChartComponent
Display data comparison with vertical or horizontal bars.

**Usage:**
```typescript
import { BarChartComponent, BarChartConfig } from './charts';

barConfig: BarChartConfig = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales',
      data: [1200, 1900, 1500, 2100, 1800, 2400],
      backgroundColor: '#3B82F6'
    },
    {
      label: 'Revenue',
      data: [3200, 4100, 3800, 4500, 4200, 5100],
      backgroundColor: '#10B981'
    }
  ],
  height: 300,
  horizontal: false // Set to true for horizontal bars
};
```

```html
<app-bar-chart [config]="barConfig"></app-bar-chart>
```

### 4. LineChartComponent
Display trends over time with line charts.

**Usage:**
```typescript
import { LineChartComponent, LineChartConfig } from './charts';

lineConfig: LineChartConfig = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'New Users',
      data: [450, 520, 480, 610],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4 // Curve smoothness (0-1)
    }
  ],
  height: 300
};
```

```html
<app-line-chart [config]="lineConfig"></app-line-chart>
```

## Complete Example

See `charts-demo.component.ts` for a complete working example with all chart types.

## Integration with Chart.js

To add actual chart rendering with Chart.js:

1. Install Chart.js:
```bash
npm install chart.js
```

2. Import in each chart component:
```typescript
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
```

3. Implement chart rendering in `ngOnInit()` and `ngOnChanges()`.

## Styling

All components use TailwindCSS for styling and are fully responsive.

## Features

- ✅ Standalone components (no module required)
- ✅ TypeScript interfaces for type safety
- ✅ Responsive design
- ✅ Empty state handling
- ✅ Customizable colors and heights
- ✅ Trend indicators for stat cards
- ✅ Multiple chart types support
