import { Component, OnInit, signal, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { AdminReportsService } from '../../../core/services/admin/reports.service';
import {
  AnalyticsOverview,
  UserGrowthData,
  ContentEngagementData,
  TopContent,
  RealtimeStats,
  PlatformSummary,
  DetailedUserGrowthTrends,
  DetailedContentEngagement,
  ReportPeriod
} from '../../../core/interfaces/admin/reports.interface';
import { BarChartComponent, BarChartConfig } from '../../../shared/components/charts/bar-chart.component';
import { LineChartComponent, LineChartConfig } from '../../../shared/components/charts/line-chart.component';
import { PieChartComponent, PieChartConfig } from '../../../shared/components/charts/pie-chart.component';

@Component({
  selector: 'reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent
  ],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit, OnDestroy {
  private reportsService = inject(AdminReportsService);
  
  overview = signal<AnalyticsOverview | null>(null);
  userGrowth = signal<UserGrowthData[]>([]);
  contentEngagement = signal<ContentEngagementData[]>([]);
  topContent = signal<TopContent[]>([]);
  realtimeStats = signal<RealtimeStats | null>(null);
  summary = signal<PlatformSummary | null>(null);
  
  // Enhanced Analytics
  detailedUserGrowth = signal<DetailedUserGrowthTrends | null>(null);
  detailedContentEngagement = signal<DetailedContentEngagement | null>(null);
  
  loading = signal(false);
  error = signal<string | null>(null);

  private destroy$ = new Subject<void>();
  private cache = new Map<string, any>();

  selectedPeriod: ReportPeriod = 'month';
  contentType = '';
  activeAnalyticsTab: 'overview' | 'user-growth' | 'content-engagement' | 'localization' = 'overview';

  private maxNewUsers = 100;
  private realtimeInterval: any;

  ngOnInit() {
    this.loadData();
    this.loadRealtimeStats();
    this.loadSummary();
    this.loadDetailedAnalytics();
    
    // Refresh realtime stats every 30 seconds
    this.realtimeInterval = setInterval(() => this.loadRealtimeStats(), 30000);
  }

  ngOnDestroy() {
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);

    const cacheKey = `period:${this.selectedPeriod}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      this.overview.set(cached.overview ?? null);
      this.userGrowth.set(cached.userGrowth ?? []);
      this.contentEngagement.set(cached.contentEngagement ?? []);
      this.maxNewUsers = Math.max(100, ...(cached.userGrowth ?? []).map((d: UserGrowthData) => d.newUsers));
      this.loading.set(false);
      // still refresh top content separately
      this.loadTopContent();
      this.loadDetailedAnalytics();
      return;
    }

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = this.getStartDate();

    const overview$ = this.reportsService.getAnalyticsOverview(this.selectedPeriod).pipe(catchError(() => of(null)));
    const userGrowth$ = this.reportsService.getUserGrowth(startDate, endDate).pipe(catchError(() => of([])));
    const engagement$ = this.reportsService.getContentEngagement(startDate, endDate).pipe(catchError(() => of([])));

    forkJoin([overview$, userGrowth$, engagement$]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([ov, ug, ce]) => {
        this.overview.set(ov as AnalyticsOverview | null);
        this.userGrowth.set(ug as UserGrowthData[]);
        this.contentEngagement.set(ce as ContentEngagementData[]);
        this.maxNewUsers = Math.max(100, ...(ug as UserGrowthData[]).map(d => d.newUsers));
        // cache lightweight snapshot
        this.cache.set(cacheKey, { overview: ov, userGrowth: ug, contentEngagement: ce, cachedAt: Date.now() });
        this.loadTopContent();
        this.loadDetailedAnalytics();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading analytics data:', err);
        this.error.set('Failed to load analytics data.');
        this.loading.set(false);
      }
    });
  }

  loadDetailedAnalytics() {
    const detailedUserGrowth$ = this.reportsService.getDetailedUserGrowthTrends(this.selectedPeriod).pipe(catchError(() => of(null)));
    const detailedEngagement$ = this.reportsService.getDetailedContentEngagement(this.selectedPeriod).pipe(catchError(() => of(null)));

    forkJoin([detailedUserGrowth$, detailedEngagement$]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([userGrowthTrends, contentEngagement]) => {
        this.detailedUserGrowth.set(userGrowthTrends as DetailedUserGrowthTrends | null);
        this.detailedContentEngagement.set(contentEngagement as DetailedContentEngagement | null);
      },
      error: (err) => {
        console.error('Error loading detailed analytics:', err);
      }
    });
  }

  loadRealtimeStats() {
    this.reportsService.getRealtimeStats().pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        console.error('Error loading realtime stats:', err);
        return of(null);
      })
    ).subscribe((data) => this.realtimeStats.set(data as RealtimeStats | null));
  }

  loadSummary() {
    this.reportsService.getSummary().pipe(takeUntil(this.destroy$), catchError(() => of(null))).subscribe((data) => this.summary.set(data as PlatformSummary | null));
  }

  loadTopContent() {
    const key = `top:${this.contentType || 'all'}`;
    if (this.cache.has(key)) {
      this.topContent.set(this.cache.get(key));
      return;
    }

    this.reportsService.getTopContent(50, this.contentType || undefined).pipe(takeUntil(this.destroy$), catchError(() => of([]))).subscribe({
      next: (data) => {
        this.topContent.set(data);
        this.cache.set(key, data);
      },
      error: (err) => {
        console.error('Error loading top content:', err);
        this.topContent.set([]);
      }
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
      case 'quarter':
        date.setMonth(date.getMonth() - 3);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date.toISOString().split('T')[0];
  }

  onPeriodChange() {
    this.loadData();
  }

  onAnalyticsTabChange(tab: string) {
    this.activeAnalyticsTab = tab as 'overview' | 'user-growth' | 'content-engagement' | 'localization';
  }

  getBarHeight(value: number, type: string): number {
    return Math.max((value / this.maxNewUsers) * 100, 5);
  }

  // trackBy helpers to avoid unnecessary re-renders
  trackByDate(index: number, item: { date: string }) {
    return item?.date ?? index;
  }

  trackByTitle(index: number, item: { title?: string, id?: string }) {
    return item?.id ?? item?.title ?? index;
  }

  // keyboard helpers for accessible list navigation
  onKeyActivate(event: KeyboardEvent, item?: TopContent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (item) this.openTopContent(item);
    }
  }

  openTopContent(item: TopContent) {
    // Defensive check
    if (!item) return;
    // Try navigating to a detail page; fallback to logging
    if (item.id) {
      try {
        window.open(`/content/${item.id}`, '_blank');
      } catch {
        console.log('Open content', item);
      }
    } else {
      console.log('Top content selected', item);
    }
  }

  exportReport(type: 'users' | 'content' | 'engagement' = 'users', format: 'csv' | 'pdf' | 'xlsx' = 'csv') {
    this.reportsService.exportReport(type, format, this.selectedPeriod).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-report-${this.selectedPeriod}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error exporting report:', err)
    });
  }

  getUserGrowthChartConfig(): BarChartConfig {
    const userGrowth = this.userGrowth();
    if (!userGrowth.length) {
      return {
        labels: [],
        datasets: [],
        height: 300
      };
    }

    return {
      labels: userGrowth.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'New Users',
          data: userGrowth.map(d => d.newUsers),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }
      ],
      height: 300
    };
  }

  getContentDistributionConfig(): PieChartConfig {
    const summary = this.summary();
    if (!summary) {
      return {
        labels: [],
        data: [],
        height: 300
      };
    }

    return {
      labels: ['Posts', 'Reviews', 'Guides', 'Questions'],
      data: [
        summary.content.posts,
        summary.content.reviews,
        summary.content.guides,
        summary.content.questions
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)', // blue
        'rgba(236, 72, 153, 0.8)', // pink
        'rgba(34, 197, 94, 0.8)',  // green
        'rgba(251, 191, 36, 0.8)'  // yellow
      ],
      height: 300,
      doughnut: true
    };
  }

  getEngagementChartConfig(): LineChartConfig {
    const engagement = this.contentEngagement();
    if (!engagement.length) {
      return {
        labels: [],
        datasets: [],
        height: 300
      };
    }

    return {
      labels: engagement.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Views',
          data: engagement.map(d => d.views),
          borderColor: 'rgba(147, 51, 234, 1)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4
        },
        {
          label: 'Likes',
          data: engagement.map(d => d.likes),
          borderColor: 'rgba(236, 72, 153, 1)',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          tension: 0.4
        },
        {
          label: 'Comments',
          data: engagement.map(d => d.comments),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }
      ],
      height: 300
    };
  }

  // Enhanced User Growth Chart with Retention
  getDetailedUserGrowthConfig(): LineChartConfig {
    const userGrowthTrends = this.detailedUserGrowth();
    if (!userGrowthTrends?.data.length) {
      return { labels: [], datasets: [], height: 400 };
    }

    return {
      labels: userGrowthTrends.data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'New Users',
          data: userGrowthTrends.data.map(d => d.newUsers),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Active Users',
          data: userGrowthTrends.data.map(d => d.activeUsers),
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        },
        {
          label: 'Retention Rate (%)',
          data: userGrowthTrends.data.map(d => d.retentionRate),
          borderColor: 'rgba(251, 191, 36, 1)',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          tension: 0.4
        }
      ],
      height: 400
    };
  }

  // Acquisition Channels Chart
  getAcquisitionChannelsConfig(): PieChartConfig {
    const userGrowthTrends = this.detailedUserGrowth();
    if (!userGrowthTrends?.acquisitionChannels.length) {
      return { labels: [], data: [], height: 300 };
    }

    return {
      labels: userGrowthTrends.acquisitionChannels.map(c => c.channel),
      data: userGrowthTrends.acquisitionChannels.map(c => c.users),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      height: 300,
      doughnut: true
    };
  }

  // Content Type Performance Chart
  getContentTypePerformanceConfig(): BarChartConfig {
    const contentEngagement = this.detailedContentEngagement();
    if (!contentEngagement?.contentTypeBreakdown.length) {
      return { labels: [], datasets: [], height: 300 };
    }

    return {
      labels: contentEngagement.contentTypeBreakdown.map(c => c.type),
      datasets: [
        {
          label: 'Total Views',
          data: contentEngagement.contentTypeBreakdown.map(c => c.totalViews),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        },
        {
          label: 'Engagement Rate (%)',
          data: contentEngagement.contentTypeBreakdown.map(c => c.avgEngagementRate),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1
        }
      ],
      height: 300
    };
  }

  // Enhanced Engagement Metrics Chart
  getEnhancedEngagementConfig(): LineChartConfig {
    const engagement = this.contentEngagement();
    if (!engagement.length) {
      return { labels: [], datasets: [], height: 400 };
    }

    return {
      labels: engagement.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Views',
          data: engagement.map(d => d.views),
          borderColor: 'rgba(147, 51, 234, 1)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4
        },
        {
          label: 'Likes',
          data: engagement.map(d => d.likes),
          borderColor: 'rgba(236, 72, 153, 1)',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          tension: 0.4
        },
        {
          label: 'Comments',
          data: engagement.map(d => d.comments),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Shares',
          data: engagement.map(d => d.shares),
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        },
        {
          label: 'Saves',
          data: engagement.map(d => d.saves || 0),
          borderColor: 'rgba(251, 191, 36, 1)',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          tension: 0.4
        }
      ],
      height: 400
    };
  }

  // Utility methods for enhanced analytics
  getRetentionColor(rate: number): string {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getGrowthTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}
