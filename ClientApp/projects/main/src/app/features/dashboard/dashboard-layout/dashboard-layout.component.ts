import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard-container">
      <nav class="dashboard-sidebar">
        <h2>User Dashboard</h2>
        <ul class="nav-menu">
          <li><a routerLink="overview" routerLinkActive="active">Overview</a></li>
          <li><a routerLink="expert" routerLinkActive="active">Expert Panel</a></li>
          <li><a routerLink="reviewer" routerLinkActive="active">Reviews</a></li>
          <li><a routerLink="content-creator" routerLinkActive="active">Content</a></li>
        </ul>
      </nav>
      <main class="dashboard-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
    }
    .dashboard-sidebar {
      width: 250px;
      background: #f8f9fa;
      padding: 1rem;
      border-right: 1px solid #dee2e6;
    }
    .dashboard-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
    .nav-menu {
      list-style: none;
      padding: 0;
    }
    .nav-menu li {
      margin: 0.5rem 0;
    }
    .nav-menu a {
      display: block;
      padding: 0.5rem;
      text-decoration: none;
      color: #333;
      border-radius: 4px;
    }
    .nav-menu a:hover,
    .nav-menu a.active {
      background: #007bff;
      color: white;
    }
  `]
})
export class DashboardLayoutComponent {}