import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatCardConfig {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-600 mb-1">{{ config.title }}</p>
          <p class="text-3xl font-bold" [ngClass]="getValueColorClass()">
            {{ config.value }}
          </p>
          <div *ngIf="config.trend" class="flex items-center gap-1 mt-2">
            <svg *ngIf="config.trend.isPositive" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
            <svg *ngIf="!config.trend.isPositive" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
            <span class="text-sm font-medium" [ngClass]="config.trend.isPositive ? 'text-green-600' : 'text-red-600'">
              {{ config.trend.value }}%
            </span>
            <span class="text-xs text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div *ngIf="config.icon" class="flex-shrink-0">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center" [ngClass]="getIconBgClass()">
            <span class="text-2xl">{{ config.icon }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StatCardComponent {
  @Input() config!: StatCardConfig;

  getValueColorClass(): string {
    const colorMap = {
      primary: 'text-blue-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      danger: 'text-red-600',
      info: 'text-cyan-600'
    };
    return colorMap[this.config.color || 'primary'];
  }

  getIconBgClass(): string {
    const colorMap = {
      primary: 'bg-blue-100',
      success: 'bg-green-100',
      warning: 'bg-yellow-100',
      danger: 'bg-red-100',
      info: 'bg-cyan-100'
    };
    return colorMap[this.config.color || 'primary'];
  }
}
