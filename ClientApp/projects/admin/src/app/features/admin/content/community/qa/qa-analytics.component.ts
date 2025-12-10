import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QaAdminService } from '../../../../../core/services/content/community/qa/qa-admin.service';
import { DateUtils } from '../../../../../core/utils/date.utils';

@Component({
  selector: 'app-qa-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './qa-analytics.component.html'
})
export class QaAnalyticsComponent implements OnInit {
  private qaAdminService = inject(QaAdminService);

  trends = signal<any>(null);
  userStats = signal<any>(null);
  loading = signal(true);
  selectedDays = signal(30);

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading.set(true);
    
    this.qaAdminService.getTrends(this.selectedDays()).subscribe({
      next: (response) => {
        if (response.success) {
          this.trends.set(response.data);
        }
      },
      error: (error) => console.error('Error loading trends:', error)
    });

    this.qaAdminService.getUserStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.userStats.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
        this.loading.set(false);
      }
    });
  }

  onDaysChange(days: number) {
    this.selectedDays.set(days);
    this.loadAnalytics();
  }

  formatDate = DateUtils.formatDate;
}
