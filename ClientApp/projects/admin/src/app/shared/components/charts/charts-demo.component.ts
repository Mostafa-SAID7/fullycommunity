import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent, PieChartConfig } from './pie-chart.component';
import { BarChartComponent, BarChartConfig } from './bar-chart.component';
import { LineChartComponent, LineChartConfig } from './line-chart.component';
import { StatCardComponent, StatCardConfig } from './stat-card.component';

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
    BarChartComponent,
    LineChartComponent,
    StatCardComponent
  ],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-stat-card [config]="totalUsersConfig"></app-stat-card>
        <app-stat-card [config]="totalPostsConfig"></app-stat-card>
        <app-stat-card [config]="activeUsersConfig"></app-stat-card>
        <app-stat-card [config]="revenueConfig"></app-stat-card>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Pie Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <app-pie-chart [config]="pieChartConfig"></app-pie-chart>
        </div>

        <!-- Bar Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
          <app-bar-chart [config]="barChartConfig"></app-bar-chart>
        </div>
      </div>

      <!-- Line Chart - Full Width -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
        <app-line-chart [config]="lineChartConfig"></app-line-chart>
      </div>
    </div>
  `
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
      isPositive: true
    }
  };

  totalPostsConfig: StatCardConfig = {
    title: 'Total Posts',
    value: '8,234',
    icon: '📝',
    color: 'success',
    trend: {
      value: 8.2,
      isPositive: true
    }
  };

  activeUsersConfig: StatCardConfig = {
    title: 'Active Users',
    value: '3,421',
    icon: '⚡',
    color: 'warning',
    trend: {
      value: 3.1,
      isPositive: false
    }
  };

  revenueConfig: StatCardConfig = {
    title: 'Revenue',
    value: '$45,231',
    icon: '💰',
    color: 'info',
    trend: {
      value: 15.3,
      isPositive: true
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
