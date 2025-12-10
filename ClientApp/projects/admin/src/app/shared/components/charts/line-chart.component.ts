import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
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
export class LineChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config!: LineChartConfig;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
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
      const Chart = await this.loadChartJS();
      if (!Chart) {
        this.renderFallbackChart();
        return;
      }

      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.config.labels,
          datasets: this.config.datasets.map(dataset => ({
            ...dataset,
            borderColor: dataset.borderColor || 'rgba(147, 51, 234, 1)',
            backgroundColor: dataset.backgroundColor || 'rgba(147, 51, 234, 0.1)',
            tension: dataset.tension || 0.4,
            fill: true
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: this.config.datasets.length > 1,
              position: 'top'
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

    ctx.clearRect(0, 0, width, height);
    
    const dataset = this.config.datasets[0];
    if (!dataset) return;

    const maxValue = Math.max(...dataset.data);
    const minValue = Math.min(...dataset.data);
    const range = maxValue - minValue || 1;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (height * 0.8) * (i / 5) + 40;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = dataset.borderColor || 'rgba(147, 51, 234, 1)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    dataset.data.forEach((value, index) => {
      const x = 40 + (index / (dataset.data.length - 1)) * (width - 60);
      const y = height - 40 - ((value - minValue) / range) * (height * 0.8);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw points
    ctx.fillStyle = dataset.borderColor || 'rgba(147, 51, 234, 1)';
    dataset.data.forEach((value, index) => {
      const x = 40 + (index / (dataset.data.length - 1)) * (width - 60);
      const y = height - 40 - ((value - minValue) / range) * (height * 0.8);
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    this.config.labels.forEach((label, index) => {
      const x = 40 + (index / (this.config.labels.length - 1)) * (width - 60);
      ctx.fillText(label, x, height - 10);
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
