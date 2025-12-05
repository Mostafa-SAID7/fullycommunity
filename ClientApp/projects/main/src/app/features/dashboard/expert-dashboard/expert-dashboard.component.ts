import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, ExpertDashboard } from '../../../core/services/business/dashboard.service';

@Component({
  selector: 'app-expert-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expert-dashboard.component.html',
})
export class ExpertDashboardComponent implements OnInit {
  dashboard: ExpertDashboard | null = null;
  loading = false;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.error = null;

    this.dashboardService.getExpertDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard. Please try again.';
        this.loading = false;
        console.error('Dashboard error:', err);
      },
    });
  }
}
