import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() variant: 'spinner' | 'dots' | 'pulse' | 'skeleton' = 'spinner';
  @Input() color: 'primary' | 'secondary' | 'white' | 'current' = 'primary';
  @Input() text?: string;
  @Input() overlay = false;
  @Input() fullscreen = false;
  @Input() centered = true;

  getContainerClasses(): string {
    const classes = ['loading-container'];
    
    classes.push(`loading-${this.size}`);
    classes.push(`loading-${this.variant}`);
    classes.push(`loading-${this.color}`);
    
    if (this.overlay) classes.push('loading-overlay');
    if (this.fullscreen) classes.push('loading-fullscreen');
    if (this.centered) classes.push('loading-centered');
    
    return classes.join(' ');
  }

  getSpinnerClasses(): string {
    const classes = ['loading-spinner'];
    classes.push(`spinner-${this.size}`);
    classes.push(`spinner-${this.color}`);
    return classes.join(' ');
  }

  getDotsClasses(): string {
    const classes = ['loading-dots'];
    classes.push(`dots-${this.size}`);
    classes.push(`dots-${this.color}`);
    return classes.join(' ');
  }

  getPulseClasses(): string {
    const classes = ['loading-pulse'];
    classes.push(`pulse-${this.size}`);
    classes.push(`pulse-${this.color}`);
    return classes.join(' ');
  }
}