import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LineChartData {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
}

export interface LineChartConfig {
  labels: string[];
  datasets: LineChartData[];
  height?: number;
}

@Component({
  selector: 'app-line-chart',
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
export class LineChartComponent implements OnInit, OnChanges {
  @Input() config!: LineChartConfig;

  get hasData(): boolean {
    return this.config?.datasets?.some(d => d.data.length > 0) ?? false;
  }

  ngOnInit() {
    // Chart.js integration would go here
    console.log('Line chart initialized with config:', this.config);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && !changes['config'].firstChange) {
      // Update chart when config changes
      console.log('Line chart config updated');
    }
  }
}
