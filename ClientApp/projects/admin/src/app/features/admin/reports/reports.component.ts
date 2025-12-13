import { Component, OnInit, signal, OnDestroy, inject, computed } from '@angular/core';
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
import { BarChartComponent, BarChartConfig } from '../../../shared/ui/charts/bar-chart/bar-chart.component';
import { LineChartComponent, LineChartConfig } from '../../../shared/ui/charts/line-chart/line-chart.component';
import { PieChartComponent, PieChartConfig } from '../../../shared/ui/charts/pie-chart/pie-chart.component';
import { StatCardComponent } from '../../../shared/ui/cards/stat-card/stat-card.component';
import { StatCardConfig } from '../../../shared/ui/cards/stat-card/stat-card.interface';
import { RefreshButtonComponent } from '../../../shared/ui/buttons/refresh-button/refresh-button.component';
import { TabNavigationComponent, Tab } from '../../../shared/ui/navigation/tab-navigation/tab-navigation.component';

@Component({
  selector: 'reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    StatCardComponent,
    RefreshButtonComponent,
    TabNavigationComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit, OnDestroy {
  private reportsService = inject(AdminReportsService);

  // Data signals
  overview = signal<AnalyticsOverview | null>(null);
  userGrowth = signal<UserGrowthData[]>([]);
  contentEngagement = signal<ContentEngagementData[]>([]);
  topContent = signal<TopContent[]>([]);
  realtimeStats = signal<RealtimeStats | null>(null);
  summary = signal<PlatformSummary | null>(null);
  detailedUserGrowth = signal<DetailedUserGrowthTrends | null>(null);
  detailedContentEngagement = signal<DetailedContentEngagement | null>(null);

  // UI state signals
  loading = signal(false);
  error = signal<string | null>(null);
  activeAnalyticsTab = signal<'overview' | 'user-growth' | 'content-engagement' | 'localization'>('overview');

  private destroy$ = new Subject<void>();
  private cache = new Map<string, any>();
  private realtimeInterval: ReturnType<typeof setInterval> | null = null;

  selectedPeriod: ReportPeriod = 'month';
  contentType = '';

  // Computed chart configs - prevents infinite change detection loops
  userGrowthChartConfig = computed<BarChartConfig>(() => {
    const data = this.userGrowth();
    if (!data.length) {
      return { labels: [], datasets: [], height: 300 };
    }
    return {
      labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'New Users',
        data: data.map(d => d.newUsers),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }],
      height: 300
    };
  });

  contentDistributionConfig = computed<PieChartConfig>(() => {
    const sum = this.summary();
    if (!sum) {
      return { labels: [], data: [], height: 300 };
    }
    return {
      labels: ['Posts', 'Reviews', 'Guides', 'Questions'],
      data: [sum.content.posts, sum.content.reviews, sum.content.guides, sum.content.questions],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)'
      ],
      height: 300,
      doughnut: true
    };
  });

  engagementChartConfig = computed<LineChartConfig>(() => {
    const data = this.contentEngagement();
    if (!data.length) {
      return { labels: [], datasets: [], height: 300 };
    }
    return {
      labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        { label: 'Views', data: data.map(d => d.views), borderColor: 'rgba(147, 51, 234, 1)', backgroundColor: 'rgba(147, 51, 234, 0.1)', tension: 0.4 },
        { label: 'Likes', data: data.map(d => d.likes), borderColor: 'rgba(236, 72, 153, 1)', backgroundColor: 'rgba(236, 72, 153, 0.1)', tension: 0.4 },
        { label: 'Comments', data: data.map(d => d.comments), borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4 }
      ],
      height: 300
    };
  });

  detailedUserGrowthConfig = computed<LineChartConfig>(() => {
    const trends = this.detailedUserGrowth();
    if (!trends?.data.length) {
      return { labels: [], datasets: [], height: 400 };
    }
    return {
      labels: trends.data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        { label: 'New Users', data: trends.data.map(d => d.newUsers), borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4 },
        { label: 'Active Users', data: trends.data.map(d => d.activeUsers), borderColor: 'rgba(34, 197, 94, 1)', backgroundColor: 'rgba(34, 197, 94, 0.1)', tension: 0.4 },
        { label: 'Retention Rate (%)', data: trends.data.map(d => d.retentionRate), borderColor: 'rgba(251, 191, 36, 1)', backgroundColor: 'rgba(251, 191, 36, 0.1)', tension: 0.4 }
      ],
      height: 400
    };
  });

  acquisitionChannelsConfig = computed<PieChartConfig>(() => {
    const trends = this.detailedUserGrowth();
    if (!trends?.acquisitionChannels.length) {
      return { labels: [], data: [], height: 300 };
    }

    return {
      labels: trends.acquisitionChannels.map(c => c.channel),
      data: trends.acquisitionChannels.map(c => c.users),
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
  });

  contentTypePerformanceConfig = computed<BarChartConfig>(() => {
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
  });

  enhancedEngagementConfig = computed<LineChartConfig>(() => {
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
  });

  // Overview stats cards configuration
  overviewStatCards = computed<StatCardConfig[]>(() => {
    const sum = this.summary();
    const ov = this.overview();
    if (!sum) return [];

    return [
      {
        title: 'Total Users',
        value: this.formatNumber(sum.users.total),
        change: ov?.userGrowthPercent ?? 0,
        icon: 'fas fa-users',
        color: 'info'
      },
      {
        title: 'Active Users',
        value: this.formatNumber(sum.users.activeThisMonth),
        change: ov?.activeUsersPercent ?? 0,
        icon: 'fas fa-user-check',
        color: 'success'
      },
      {
        title: 'Total Content',
        value: this.formatNumber(sum.content.posts + sum.content.reviews + sum.content.guides + sum.content.questions),
        change: ov?.revenueGrowthPercent ?? 0, // Fallback as content growth not showing
        icon: 'fas fa-file-alt',
        color: 'primary'
      },
      {
        title: 'Engagement Views',
        value: this.formatNumber(sum.engagement.totalViews),
        change: ov?.contentEngagementPercent ?? 0,
        icon: 'fas fa-chart-line',
        color: 'warning'
      }
    ];
  });

  // Analytics tab items
  analyticsTabItems: Tab[] = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
    { id: 'user-growth', label: 'User Growth', icon: 'fas fa-user-plus' },
    { id: 'content-engagement', label: 'Content Engagement', icon: 'fas fa-heart' },
    { id: 'localization', label: 'Localization', icon: 'fas fa-globe' }
  ];

  /*
   * Helper Methods
   * -------------------------------------------------------------------------
   */

  ngOnInit(): void {
    this.refreshReports();

    // Setup realtime updates
    this.realtimeInterval = setInterval(() => {
      this.loadRealtimeStats();
    }, 30000); // Update every 30 seconds
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.realtimeInterval) {
      clearInterval(this.realtimeInterval);
    }
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);

    const cacheKey = `${this.selectedPeriod}`;

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      // check if cache is fresh (e.g. < 5 mins)
      if (Date.now() - cached.cachedAt < 300000) {
        this.overview.set(cached.overview);
        this.userGrowth.set(cached.userGrowth ?? []);
        this.contentEngagement.set(cached.contentEngagement ?? []);
        this.loading.set(false);
        // still refresh top content separately
        this.loadTopContent();
        this.loadDetailedAnalytics();
        return;
      }
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
    this.activeAnalyticsTab.set(tab as 'overview' | 'user-growth' | 'content-engagement' | 'localization');
  }

  refreshReports() {
    // Clear cache to force fresh data
    this.cache.clear();
    this.loadData();
    this.loadRealtimeStats();
    this.loadSummary();
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
    this.reportsService.exportReport(type, format, this.selectedPeriod)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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



  // Utility methods for enhanced analytics
  getRetentionColor(rate: number): string {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
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
