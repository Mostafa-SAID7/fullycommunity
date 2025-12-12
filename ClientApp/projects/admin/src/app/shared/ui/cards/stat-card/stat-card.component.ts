import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardConfig } from './stat-card.interface';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
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