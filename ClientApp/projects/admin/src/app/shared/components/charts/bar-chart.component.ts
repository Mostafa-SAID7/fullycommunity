import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative" [style.height.px]="config.height || 300">
      <canvas #chartCanvas></canvas>
      <div *ngIf="!hasData" class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
        <p class="text-gray-400">No data available</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() config!: BarChartConfig;

  get hasData(): boolean {
    return this.config?.datasets?.some(d => d.data.length > 0) ?? false;
  }

  ngOnInit() {
    // Chart.js integration would go here
    console.log('Bar chart initialized with config:', this.config);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && !changes['config'].firstChange) {
      // Update chart when config changes
      console.log('Bar chart config updated');
    }
  }
}
