import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
    <div class="relative w-full" [style.height.px]="config.height || 300">
      <canvas #chartCanvas class="w-full h-full"></canvas>
      <div *ngIf="!hasData" class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
        <div class="text-center">
          <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <p class="text-gray-400 text-sm">No chart data available</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    canvas {
      max-width: 100%;
      height: auto !important;
    }
  `]
})
export class BarChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config!: BarChartConfig;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: any;
  private chartInstance: any;

  get hasData(): boolean {
    return this.config?.datasets?.some(d => d.data.length > 0) ?? false;
  }

  ngOnInit() {
    if (this.hasData) {
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && !changes['config'].firstChange) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  private async initChart() {
    try {
      // Dynamic import for Chart.js (if available)
      const Chart = await this.loadChartJS();
      if (!Chart) {
        this.renderFallbackChart();
        return;
      }

      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      this.chartInstance = new Chart(ctx, {
        type: this.config.horizontal ? 'horizontalBar' : 'bar',
        data: {
          labels: this.config.labels,
          datasets: this.config.datasets.map(dataset => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor || 'rgba(59, 130, 246, 0.8)',
            borderColor: dataset.borderColor || 'rgba(59, 130, 246, 1)',
            borderWidth: dataset.borderWidth || 1
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: this.config.datasets.length > 1
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    } catch (error) {
      console.warn('Chart.js not available, using fallback rendering');
      this.renderFallbackChart();
    }
  }

  private async loadChartJS(): Promise<any> {
    try {
      // Try to load Chart.js dynamically
      const chartModule = await import('chart.js/auto');
      return chartModule.default || chartModule;
    } catch (error) {
      console.warn('Chart.js not available:', error);
      return null;
    }
  }

  private renderFallbackChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx || !this.hasData) return;

    const canvas = this.chartCanvas.nativeElement;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Simple fallback bar chart rendering
    ctx.clearRect(0, 0, width, height);
    
    const dataset = this.config.datasets[0];
    if (!dataset) return;

    const maxValue = Math.max(...dataset.data);
    const barWidth = width / dataset.data.length * 0.8;
    const barSpacing = width / dataset.data.length * 0.2;

    dataset.data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height * 0.8);
      const x = index * (barWidth + barSpacing) + barSpacing / 2;
      const y = height - barHeight - 20;

      ctx.fillStyle = Array.isArray(dataset.backgroundColor) 
        ? dataset.backgroundColor[index] || 'rgba(59, 130, 246, 0.8)'
        : dataset.backgroundColor || 'rgba(59, 130, 246, 0.8)';
      
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw value labels
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      
      // Draw x-axis labels
      if (this.config.labels[index]) {
        ctx.fillText(this.config.labels[index], x + barWidth / 2, height - 5);
      }
    });
  }

  private updateChart() {
    if (this.chartInstance) {
      this.chartInstance.data.labels = this.config.labels;
      this.chartInstance.data.datasets = this.config.datasets;
      this.chartInstance.update();
    } else if (this.hasData) {
      this.initChart();
    }
  }
}
