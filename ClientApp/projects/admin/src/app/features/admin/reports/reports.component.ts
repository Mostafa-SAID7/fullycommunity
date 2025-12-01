import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports">
      <h1>Reports & Analytics</h1>
      <div class="report-cards">
        <div class="report-card">
          <h3>User Growth</h3>
          <p class="metric">+15.2%</p>
        </div>
        <div class="report-card">
          <h3>Content Engagement</h3>
          <p class="metric">+8.7%</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports { max-width: 1200px; }
    .report-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .report-card { background: white; padding: 1.5rem; border-radius: 8px; text-align: center; }
    .metric { font-size: 2rem; font-weight: bold; color: #28a745; }
  `]
})
export class ReportsComponent {}