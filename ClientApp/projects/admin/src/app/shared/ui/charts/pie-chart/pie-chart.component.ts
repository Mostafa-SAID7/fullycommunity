import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config!: PieChartConfig;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chartInstance: any;

  get hasData(): boolean {
    return (this.config?.data?.length ?? 0) > 0;
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
        type: this.config.doughnut ? 'doughnut' : 'pie',
        data: {
          labels: this.config.labels,
          datasets: [{
            data: this.config.data,
            backgroundColor: this.config.backgroundColor || [
              'rgba(59, 130, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(147, 51, 234, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed} (${percentage}%)`;
                }
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
    
    const centerX = width / 2;
    const centerY = height / 2 - 20; // Leave space for legend
    const radius = Math.min(width, height) / 3;
    
    const total = this.config.data.reduce((sum, value) => sum + value, 0);
    const colors = this.config.backgroundColor || [
      'rgba(59, 130, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(147, 51, 234, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ];

    let currentAngle = -Math.PI / 2; // Start from top

    // Draw pie slices
    this.config.data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      currentAngle += sliceAngle;
    });

    // Draw doughnut hole if needed
    if (this.config.doughnut) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // Draw legend
    const legendY = height - 60;
    const legendItemWidth = width / this.config.labels.length;
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    this.config.labels.forEach((label, index) => {
      const x = (index + 0.5) * legendItemWidth;
      
      // Draw color box
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x - 6, legendY, 12, 12);
      
      // Draw label
      ctx.fillStyle = '#374151';
      ctx.fillText(label, x, legendY + 25);
      
      // Draw percentage
      const percentage = ((this.config.data[index] / total) * 100).toFixed(1);
      ctx.fillText(`${percentage}%`, x, legendY + 40);
    });
  }

  private updateChart() {
    if (this.chartInstance) {
      this.chartInstance.data.labels = this.config.labels;
      this.chartInstance.data.datasets[0].data = this.config.data;
      this.chartInstance.update();
    } else if (this.hasData) {
      this.initChart();
    }
  }
}
