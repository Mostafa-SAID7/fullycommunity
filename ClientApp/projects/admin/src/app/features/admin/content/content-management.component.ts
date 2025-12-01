import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'content-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-management">
      <div class="page-header">
        <h1>Content Management</h1>
        <div class="header-actions">
          <button class="btn-secondary">Export Data</button>
          <button class="btn-primary">Create Content</button>
        </div>
      </div>
      
      <div class="content-stats">
        <div class="stat-card">
          <h3>Total Posts</h3>
          <p class="stat-number">2,450</p>
        </div>
        <div class="stat-card">
          <h3>Reviews</h3>
          <p class="stat-number">1,820</p>
        </div>
        <div class="stat-card">
          <h3>Guides</h3>
          <p class="stat-number">340</p>
        </div>
        <div class="stat-card">
          <h3>Pending Approval</h3>
          <p class="stat-number">23</p>
        </div>
      </div>
      
      <div class="content-filters">
        <input type="text" placeholder="Search content..." class="search-input">
        <select class="filter-select">
          <option value="">All Types</option>
          <option value="post">Posts</option>
          <option value="review">Reviews</option>
          <option value="guide">Guides</option>
          <option value="qa">Q&A</option>
        </select>
        <select class="filter-select">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div class="content-list">
        <div class="content-item">
          <div class="content-info">
            <h3>How to Change Engine Oil in BMW X5</h3>
            <p class="content-meta">
              <span class="content-type guide">Guide</span>
              <span>by John Expert</span>
              <span>March 15, 2024</span>
            </p>
          </div>
          <div class="content-stats-inline">
            <span>👁️ 1,240 views</span>
            <span>👍 89 likes</span>
            <span>💬 23 comments</span>
          </div>
          <div class="content-actions">
            <button class="btn-sm">Edit</button>
            <button class="btn-sm">View</button>
            <button class="btn-sm danger">Delete</button>
          </div>
        </div>
        
        <div class="content-item">
          <div class="content-info">
            <h3>BMW Service Center Review - Downtown Location</h3>
            <p class="content-meta">
              <span class="content-type review">Review</span>
              <span>by Sarah Reviewer</span>
              <span>March 14, 2024</span>
            </p>
          </div>
          <div class="content-stats-inline">
            <span>👁️ 890 views</span>
            <span>👍 45 likes</span>
            <span>💬 12 comments</span>
          </div>
          <div class="content-actions">
            <button class="btn-sm">Edit</button>
            <button class="btn-sm">View</button>
            <button class="btn-sm danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-management {
      max-width: 1400px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .header-actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .content-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-card h3 {
      margin: 0 0 0.5rem 0;
      color: #666;
    }
    
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 0;
    }
    
    .content-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .search-input, .filter-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .search-input {
      flex: 1;
    }
    
    .content-list {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .content-item {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .content-info {
      flex: 1;
    }
    
    .content-info h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }
    
    .content-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }
    
    .content-type {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .content-type.guide { background: #28a745; color: white; }
    .content-type.review { background: #007bff; color: white; }
    .content-type.post { background: #17a2b8; color: white; }
    
    .content-stats-inline {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin: 0 2rem;
      font-size: 0.9rem;
      color: #666;
    }
    
    .content-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }
    
    .btn-sm.danger {
      background: #dc3545;
      color: white;
      border-color: #dc3545;
    }
  `]
})
export class ContentManagementComponent {}