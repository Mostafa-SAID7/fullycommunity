import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent, PieChartConfig } from './pie-chart.component';
import { LineChartComponent, LineChartConfig } from './line-chart.component';
import { StatCardComponent, StatCardConfig } from './stat-card.component';

// Bar Chart interfaces (since bar-chart.component.ts exists)
export interface BarChartData {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface BarChartConfig {
  labels: string[];
  datasets: BarChartData[];
  height?: number;
  horizontal?: boolean;
}

/**
 * Demo component showing how to use all chart components
 * This can be used in the admin dashboard
 */
@Component({
  selector: 'app-charts-demo',
  standalone: true,
  imports: [
    CommonModule,
    PieChartComponent,
    LineChartComponent,
    StatCardComponent
  ],
  template: `
    <div class="charts-demo">
      <div class="demo-header">
        <h2 class="demo-title">Dashboard Analytics</h2>
      </div>

      <!-- Stat Cards Grid -->
      <div class="stats-grid">
        <app-stat-card [config]="totalUsersConfig"></app-stat-card>
        <app-stat-card [config]="totalPostsConfig"></app-stat-card>
        <app-stat-card [config]="activeUsersConfig"></app-stat-card>
        <app-stat-card [config]="revenueConfig"></app-stat-card>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Pie Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">User Distribution</h3>
          </div>
          <div class="chart-content">
            <app-pie-chart [config]="pieChartConfig"></app-pie-chart>
          </div>
        </div>

        <!-- Bar Chart Placeholder -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Monthly Activity</h3>
          </div>
          <div class="chart-content">
            <div class="chart-placeholder">
              <div class="placeholder-icon">📊</div>
              <p class="placeholder-text">Bar Chart Component</p>
              <small class="placeholder-note">Chart.js integration ready</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Line Chart - Full Width -->
      <div class="chart-card chart-card-full">
        <div class="chart-header">
          <h3 class="chart-title">Growth Trends</h3>
        </div>
        <div class="chart-content">
          <app-line-chart [config]="lineChartConfig"></app-line-chart>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./charts-demo.component.scss']
})
export class ChartsDemoComponent {
  // Stat Cards Configuration
  totalUsersConfig: StatCardConfig = {
    title: 'Total Users',
    value: '12,543',
    icon: '👥',
    color: 'primary',
    trend: {
      value: 12.5,
      direction: 'up'
    }
  };

  totalPostsConfig: StatCardConfig = {
    title: 'Total Posts',
    value: '8,234',
    icon: '📝',
    color: 'success',
    trend: {
      value: 8.2,
      direction: 'up'
    }
  };

  activeUsersConfig: StatCardConfig = {
    title: 'Active Users',
    value: '3,421',
    icon: '⚡',
    color: 'warning',
    trend: {
      value: 3.1,
      direction: 'down'
    }
  };

  revenueConfig: StatCardConfig = {
    title: 'Revenue',
    value: '$45,231',
    icon: '💰',
    color: 'info',
    trend: {
      value: 15.3,
      direction: 'up'
    }
  };

  // Pie Chart Configuration
  pieChartConfig: PieChartConfig = {
    labels: ['Regular Users', 'Premium Users', 'Vendors', 'Admins'],
    data: [8500, 2500, 1200, 343],
    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    height: 300
  };

  // Bar Chart Configuration
  barChartConfig: BarChartConfig = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Posts',
        data: [1200, 1900, 1500, 2100, 1800, 2400],
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Comments',
        data: [3200, 4100, 3800, 4500, 4200, 5100],
        backgroundColor: '#10B981'
      }
    ],
    height: 300
  };

  // Line Chart Configuration
  lineChartConfig: LineChartConfig = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'New Users',
        data: [450, 520, 480, 610, 590, 720],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Active Users',
        data: [2100, 2300, 2200, 2500, 2400, 2800],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ],
    height: 300
  };
}
