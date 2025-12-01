import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviewer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reviewer-dashboard">
      <h1>Reviewer Dashboard</h1>
      <div class="dashboard-sections">
        <section class="my-reviews">
          <h2>My Reviews</h2>
          <div class="review-list">
            <div class="review-item">
              <h3>BMW Service Center - Downtown</h3>
              <div class="rating">★★★★☆ 4/5</div>
              <p>Great service, professional staff...</p>
              <span class="review-date">Posted 3 days ago</span>
            </div>
            <div class="review-item">
              <h3>AutoZone Parts Store</h3>
              <div class="rating">★★★★★ 5/5</div>
              <p>Excellent selection and competitive prices...</p>
              <span class="review-date">Posted 1 week ago</span>
            </div>
          </div>
        </section>
        
        <section class="review-requests">
          <h2>Review Requests</h2>
          <div class="request-list">
            <div class="request-item">
              <h3>Mercedes Service Experience</h3>
              <p>Share your experience with Mercedes service center</p>
              <button class="btn-review">Write Review</button>
            </div>
            <div class="request-item">
              <h3>Tire Installation Service</h3>
              <p>How was your tire installation experience?</p>
              <button class="btn-review">Write Review</button>
            </div>
          </div>
        </section>
        
        <section class="reviewer-stats">
          <h2>Reviewer Statistics</h2>
          <div class="stats">
            <div class="stat">
              <span class="number">28</span>
              <span class="label">Reviews Written</span>
            </div>
            <div class="stat">
              <span class="number">1,240</span>
              <span class="label">Helpful Votes</span>
            </div>
            <div class="stat">
              <span class="number">Gold</span>
              <span class="label">Reviewer Badge</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .reviewer-dashboard {
      max-width: 1200px;
    }
    .dashboard-sections {
      display: grid;
      gap: 2rem;
      margin-top: 2rem;
    }
    .my-reviews, .review-requests, .reviewer-stats {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .review-item, .request-item {
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .rating {
      color: #ffc107;
      font-weight: bold;
      margin: 0.5rem 0;
    }
    .review-date {
      color: #666;
      font-size: 0.9rem;
    }
    .btn-review {
      background: #007bff;
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
export class ReviewerDashboardComponent {}