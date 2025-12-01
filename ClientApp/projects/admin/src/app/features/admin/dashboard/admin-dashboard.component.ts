import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Total Users</h3>
            <p class="stat-number">12,450</p>
            <span class="stat-change positive">+5.2% this month</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <h3>Content Items</h3>
            <p class="stat-number">8,920</p>
            <span class="stat-change positive">+12.1% this month</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🛡️</div>
          <div class="stat-info">
            <h3>Pending Moderation</h3>
            <p class="stat-number">23</p>
            <span class="stat-change negative">Needs attention</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>Active Sessions</h3>
            <p class="stat-number">1,240</p>
            <span class="stat-change neutral">Real-time</span>
          </div>
        </div>
      </div>
      
      <div class="dashboard-grid">
        <section class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-type user">User</span>
              <span class="activity-desc">New user registration: john.doe@email.com</span>
              <span class="activity-time">5 minutes ago</span>
            </div>
            <div class="activity-item">
              <span class="activity-type content">Content</span>
              <span class="activity-desc">New review posted for BMW Service Center</span>
              <span class="activity-time">12 minutes ago</span>
            </div>
            <div class="activity-item">
              <span class="activity-type moderation">Report</span>
              <span class="activity-desc">Content reported for inappropriate language</span>
              <span class="activity-time">25 minutes ago</span>
            </div>
          </div>
        </section>
        
        <section class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button class="action-btn primary">Create Announcement</button>
            <button class="action-btn secondary">Export User Data</button>
            <button class="action-btn warning">Review Reports</button>
            <button class="action-btn info">System Backup</button>
          </div>
        </section>
        
        <section class="system-status">
          <h2>System Status</h2>
          <div class="status-list">
            <div class="status-item">
              <span class="status-indicator online"></span>
              <span class="status-label">API Server</span>
              <span class="status-value">Online</span>
            </div>
            <div class="status-item">
              <span class="status-indicator online"></span>
              <span class="status-label">Database</span>
              <span class="status-value">Healthy</span>
            </div>
            <div class="status-item">
              <span class="status-indicator warning"></span>
              <span class="status-label">Cache Server</span>
              <span class="status-value">High Load</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      max-width: 1400px;
    }
    
    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 50%;
    }
    
    .stat-info h3 {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
      color: #2c3e50;
    }
    
    .stat-change {
      font-size: 0.8rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    
    .stat-change.positive {
      background: #d4edda;
      color: #155724;
    }
    
    .stat-change.negative {
      background: #f8d7da;
      color: #721c24;
    }
    
    .stat-change.neutral {
      background: #d1ecf1;
      color: #0c5460;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    
    .recent-activity, .quick-actions, .system-status {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .activity-type {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
      min-width: 80px;
      text-align: center;
    }
    
    .activity-type.user { background: #007bff; color: white; }
    .activity-type.content { background: #28a745; color: white; }
    .activity-type.moderation { background: #dc3545; color: white; }
    
    .activity-desc {
      flex: 1;
    }
    
    .activity-time {
      color: #666;
      font-size: 0.9rem;
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .action-btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .action-btn.primary { background: #007bff; color: white; }
    .action-btn.secondary { background: #6c757d; color: white; }
    .action-btn.warning { background: #ffc107; color: #212529; }
    .action-btn.info { background: #17a2b8; color: white; }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .status-indicator.online { background: #28a745; }
    .status-indicator.warning { background: #ffc107; }
    .status-indicator.offline { background: #dc3545; }
    
    .status-label {
      flex: 1;
    }
    
    .status-value {
      font-weight: 500;
    }
  `]
})
export class AdminDashboardComponent {}