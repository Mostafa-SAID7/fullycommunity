import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  AdminReportsService, 
  AnalyticsOverview, 
  UserGrowthData, 
  ContentEngagementData, 
  TopContent,
  RealtimeStats,
  PlatformSummary
} from '../../../core/services/admin-reports.service';

@Component({
  selector: 'reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit, OnDestroy {
  overview = signal<AnalyticsOverview | null>(null);
  userGrowth = signal<UserGrowthData[]>([]);
  contentEngagement = signal<ContentEngagementData[]>([]);
  topContent = signal<TopContent[]>([]);
  realtimeStats = signal<RealtimeStats | null>(null);
  summary = signal<PlatformSummary | null>(null);
  loading = signal(false);

  selectedPeriod: 'day' | 'week' | 'month' | 'year' = 'month';
  contentType = '';

  private maxNewUsers = 100;
  private realtimeInterval: any;

  constructor(private reportsService: AdminReportsService) {}

  ngOnInit() {
    this.loadData();
    this.loadRealtimeStats();
    this.loadSummary();
    
    // Refresh realtime stats every 30 seconds
    this.realtimeInterval = setInterval(() => this.loadRealtimeStats(), 30000);
  }

  ngOnDestroy() {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
    }
  }

  loadData() {
    this.loading.set(true);
    
    this.reportsService.getAnalyticsOverview(this.selectedPeriod).subscribe({
      next: (data) => this.overview.set(data),
      error: (err) => console.error('Error loading overview:', err)
    });

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = this.getStartDate();

    this.reportsService.getUserGrowth(startDate, endDate).subscribe({
      next: (data) => {
        this.userGrowth.set(data);
        this.maxNewUsers = Math.max(...data.map(d => d.newUsers), 100);
      },
      error: (err) => console.error('Error loading user growth:', err)
    });

    this.reportsService.getContentEngagement(startDate, endDate).subscribe({
      next: (data) => this.contentEngagement.set(data),
      error: (err) => console.error('Error loading engagement:', err)
    });

    this.loadTopContent();
    this.loading.set(false);
  }

  loadRealtimeStats() {
    this.reportsService.getRealtimeStats().subscribe({
      next: (data) => this.realtimeStats.set(data),
      error: (err) => console.error('Error loading realtime stats:', err)
    });
  }

  loadSummary() {
    this.reportsService.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: (err) => console.error('Error loading summary:', err)
    });
  }

  loadTopContent() {
    this.reportsService.getTopContent(10, this.contentType || undefined).subscribe({
      next: (data) => this.topContent.set(data),
      error: (err) => console.error('Error loading top content:', err)
    });
  }

  getStartDate(): string {
    const date = new Date();
    switch (this.selectedPeriod) {
      case 'day':
        return date.toISOString().split('T')[0];
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date.toISOString().split('T')[0];
  }

  getBarHeight(value: number, type: string): number {
    return Math.max((value / this.maxNewUsers) * 100, 5);
  }

  exportReport() {
    this.reportsService.exportReport('users', 'csv').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${this.selectedPeriod}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error exporting report:', err)
    });
  }
}
