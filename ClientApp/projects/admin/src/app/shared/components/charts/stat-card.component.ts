import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatCardConfig {
  title: string;
  value: number | string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-card-header">
        <div class="stat-card-icon" [ngClass]="getIconBgClass()">
          <span class="stat-card-icon-text">{{ config.icon }}</span>
        </div>
        <div *ngIf="config.trend" class="stat-card-trend" [ngClass]="getTrendClass()">
          <svg class="stat-card-trend-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path *ngIf="config.trend.direction === 'up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            <path *ngIf="config.trend.direction === 'down'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
          </svg>
          <span>{{ config.trend.value }}%</span>
        </div>
      </div>
      <div class="stat-card-content">
        <h3 class="stat-card-title">{{ config.title }}</h3>
        <p class="stat-card-value" [ngClass]="getValueClass()">{{ config.value }}</p>
        <p *ngIf="config.subtitle" class="stat-card-subtitle">{{ config.subtitle }}</p>
      </div>
    </div>
  `,
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input() config!: StatCardConfig;

  getIconBgClass(): string {
    const classes = {
      primary: 'stat-card-icon-primary',
      success: 'stat-card-icon-success',
      warning: 'stat-card-icon-warning',
      danger: 'stat-card-icon-danger',
      info: 'stat-card-icon-info'
    };
    return classes[this.config.color] || classes.primary;
  }

  getValueClass(): string {
    const classes = {
      primary: 'stat-card-value-primary',
      success: 'stat-card-value-success',
      warning: 'stat-card-value-warning',
      danger: 'stat-card-value-danger',
      info: 'stat-card-value-info'
    };
    return classes[this.config.color] || classes.primary;
  }

  getTrendClass(): string {
    return this.config.trend?.direction === 'up' ? 'stat-card-trend-up' : 'stat-card-trend-down';
  }
}