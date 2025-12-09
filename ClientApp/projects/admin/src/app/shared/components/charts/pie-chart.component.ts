import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PieChartConfig {
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  height?: number;
  doughnut?: boolean;
}

@Component({
  selector: 'app-pie-chart',
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
export class PieChartComponent implements OnInit, OnChanges {
  @Input() config!: PieChartConfig;

  get hasData(): boolean {
    return (this.config?.data?.length ?? 0) > 0;
  }

  ngOnInit() {
    // Chart.js integration would go here
    console.log('Pie chart initialized with config:', this.config);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && !changes['config'].firstChange) {
      // Update chart when config changes
      console.log('Pie chart config updated');
    }
  }
}
