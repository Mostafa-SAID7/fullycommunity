import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardService,
  AdminDashboardOverview,
} from '../../../core/services/dashboard.service';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  overview: AdminDashboardOverview | null = null;
  loading = false;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.error = null;

    this.dashboardService.getOverview().subscribe({
      next: (data) => {
        this.overview = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data. Please try again.';
        this.loading = false;
        console.error('Dashboard error:', err);
      },
    });
  }

  getTotalContent(): number {
    if (!this.overview) return 0;
    return (
      this.overview.content.totalPosts +
      this.overview.content.totalQuestions +
      this.overview.content.totalReviews +
      this.overview.content.totalGuides +
      this.overview.content.totalPodcasts
    );
  }
}
