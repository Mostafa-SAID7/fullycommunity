import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overview-container">
      <h1>Dashboard Overview</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>My Reviews</h3>
          <p class="stat-number">24</p>
        </div>
        <div class="stat-card">
          <h3>Expert Answers</h3>
          <p class="stat-number">12</p>
        </div>
        <div class="stat-card">
          <h3>Content Created</h3>
          <p class="stat-number">8</p>
        </div>
        <div class="stat-card">
          <h3>Community Points</h3>
          <p class="stat-number">1,250</p>
        </div>
      </div>
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div class="activity-item">
            <span class="activity-type">Review</span>
            <span class="activity-desc">Reviewed BMW X5 service center</span>
            <span class="activity-time">2 hours ago</span>
          </div>
          <div class="activity-item">
            <span class="activity-type">Expert</span>
            <span class="activity-desc">Answered question about engine maintenance</span>
            <span class="activity-time">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-container {
      max-width: 1200px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
      margin: 0.5rem 0;
    }
    .recent-activity {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    .activity-type {
      background: #007bff;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }
  `]
})
export class OverviewComponent {}