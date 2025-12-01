import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-creator-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-creator-dashboard">
      <h1>Content Creator Dashboard</h1>
      <div class="dashboard-sections">
        <section class="my-content">
          <h2>My Content</h2>
          <div class="content-list">
            <div class="content-item">
              <h3>How to Change Engine Oil - Video Tutorial</h3>
              <div class="content-stats">
                <span>👁️ 2,450 views</span>
                <span>👍 89 likes</span>
                <span>💬 23 comments</span>
              </div>
              <span class="content-date">Published 5 days ago</span>
            </div>
            <div class="content-item">
              <h3>Winter Car Maintenance Guide</h3>
              <div class="content-stats">
                <span>👁️ 1,820 views</span>
                <span>👍 67 likes</span>
                <span>💬 15 comments</span>
              </div>
              <span class="content-date">Published 2 weeks ago</span>
            </div>
          </div>
        </section>
        
        <section class="content-ideas">
          <h2>Content Ideas</h2>
          <div class="idea-list">
            <div class="idea-item">
              <h3>Electric Vehicle Charging Tips</h3>
              <p>Trending topic with high engagement potential</p>
              <button class="btn-create">Start Creating</button>
            </div>
            <div class="idea-item">
              <h3>DIY Car Detailing</h3>
              <p>Popular search term in your area</p>
              <button class="btn-create">Start Creating</button>
            </div>
          </div>
        </section>
        
        <section class="creator-stats">
          <h2>Creator Statistics</h2>
          <div class="stats">
            <div class="stat">
              <span class="number">15</span>
              <span class="label">Content Published</span>
            </div>
            <div class="stat">
              <span class="number">12.5K</span>
              <span class="label">Total Views</span>
            </div>
            <div class="stat">
              <span class="number">450</span>
              <span class="label">Followers</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .content-creator-dashboard {
      max-width: 1200px;
    }
    .dashboard-sections {
      display: grid;
      gap: 2rem;
      margin-top: 2rem;
    }
    .my-content, .content-ideas, .creator-stats {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .content-item, .idea-item {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .content-stats {
      display: flex;
      gap: 1rem;
      margin: 0.5rem 0;
      font-size: 0.9rem;
    }
    .content-date {
      color: #666;
      font-size: 0.9rem;
    }
    .btn-create {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
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
export class ContentCreatorDashboardComponent {}