import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>CommunityCar Admin</h1>
        <div class="admin-user">
          <span>Admin User</span>
          <button class="logout-btn">Logout</button>
        </div>
      </header>
      
      <div class="admin-body">
        <nav class="admin-sidebar">
          <ul class="admin-nav">
            <li><a routerLink="dashboard" routerLinkActive="active">📊 Dashboard</a></li>
            <li><a routerLink="users" routerLinkActive="active">👥 User Management</a></li>
            <li><a routerLink="content" routerLinkActive="active">📝 Content Management</a></li>
            <li><a routerLink="moderation" routerLinkActive="active">🛡️ Moderation</a></li>
            <li><a routerLink="reports" routerLinkActive="active">📈 Reports & Analytics</a></li>
            <li><a routerLink="settings" routerLinkActive="active">⚙️ System Settings</a></li>
          </ul>
        </nav>
        
        <main class="admin-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .admin-header {
      background: #2c3e50;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .admin-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .admin-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .admin-body {
      flex: 1;
      display: flex;
    }
    
    .admin-sidebar {
      width: 280px;
      background: #34495e;
      color: white;
      padding: 1rem 0;
    }
    
    .admin-nav {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .admin-nav li {
      margin: 0;
    }
    
    .admin-nav a {
      display: block;
      padding: 1rem 2rem;
      color: #bdc3c7;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }
    
    .admin-nav a:hover {
      background: #2c3e50;
      color: white;
      border-left-color: #3498db;
    }
    
    .admin-nav a.active {
      background: #2c3e50;
      color: white;
      border-left-color: #e74c3c;
    }
    
    .admin-content {
      flex: 1;
      padding: 2rem;
      background: #ecf0f1;
      overflow-y: auto;
    }
  `]
})
export class AdminLayoutComponent {}