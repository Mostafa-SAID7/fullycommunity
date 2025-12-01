import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="expert-dashboard">
      <h1>Expert Dashboard</h1>
      <div class="dashboard-sections">
        <section class="pending-questions">
          <h2>Pending Questions</h2>
          <div class="question-list">
            <div class="question-item">
              <h3>Engine oil change frequency for hybrid cars?</h3>
              <p>Asked by: John D. • 2 hours ago</p>
              <button class="btn-answer">Answer</button>
            </div>
            <div class="question-item">
              <h3>Best practices for winter car maintenance?</h3>
              <p>Asked by: Sarah M. • 4 hours ago</p>
              <button class="btn-answer">Answer</button>
            </div>
          </div>
        </section>
        
        <section class="my-expertise">
          <h2>My Expertise Areas</h2>
          <div class="expertise-tags">
            <span class="tag">Engine Maintenance</span>
            <span class="tag">Hybrid Vehicles</span>
            <span class="tag">Electrical Systems</span>
            <span class="tag">Diagnostics</span>
          </div>
        </section>
        
        <section class="expert-stats">
          <h2>Expert Statistics</h2>
          <div class="stats">
            <div class="stat">
              <span class="number">156</span>
              <span class="label">Questions Answered</span>
            </div>
            <div class="stat">
              <span class="number">4.8</span>
              <span class="label">Average Rating</span>
            </div>
            <div class="stat">
              <span class="number">92%</span>
              <span class="label">Helpful Rate</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .expert-dashboard {
      max-width: 1200px;
    }
    .dashboard-sections {
      display: grid;
      gap: 2rem;
      margin-top: 2rem;
    }
    .pending-questions, .my-expertise, .expert-stats {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .question-item {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .btn-answer {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .expertise-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .tag {
      background: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    .stat {
      text-align: center;
    }
    .number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
    }
    .label {
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class ExpertDashboardComponent {}