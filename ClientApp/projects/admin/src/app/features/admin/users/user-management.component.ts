import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-management">
      <div class="page-header">
        <h1>User Management</h1>
        <button class="btn-primary">Add New User</button>
      </div>
      
      <div class="filters">
        <input type="text" placeholder="Search users..." class="search-input">
        <select class="filter-select">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="expert">Expert</option>
          <option value="reviewer">Reviewer</option>
          <option value="user">User</option>
        </select>
        <select class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>
      </div>
      
      <div class="user-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="user-info">
                  <div class="avatar">JD</div>
                  <span>John Doe</span>
                </div>
              </td>
              <td>john.doe@email.com</td>
              <td><span class="role-badge expert">Expert</span></td>
              <td><span class="status-badge active">Active</span></td>
              <td>2024-01-15</td>
              <td>
                <button class="btn-sm">Edit</button>
                <button class="btn-sm danger">Ban</button>
              </td>
            </tr>
            <tr>
              <td>
                <div class="user-info">
                  <div class="avatar">SM</div>
                  <span>Sarah Miller</span>
                </div>
              </td>
              <td>sarah.m@email.com</td>
              <td><span class="role-badge reviewer">Reviewer</span></td>
              <td><span class="status-badge active">Active</span></td>
              <td>2024-02-20</td>
              <td>
                <button class="btn-sm">Edit</button>
                <button class="btn-sm danger">Ban</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .user-management {
      max-width: 1400px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .filters {
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
    
    .user-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background: #f8f9fa;
      font-weight: 600;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #007bff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    .role-badge, .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .role-badge.expert { background: #28a745; color: white; }
    .role-badge.reviewer { background: #007bff; color: white; }
    .role-badge.admin { background: #dc3545; color: white; }
    
    .status-badge.active { background: #d4edda; color: #155724; }
    .status-badge.inactive { background: #f8d7da; color: #721c24; }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      margin-right: 0.5rem;
    }
    
    .btn-sm.danger {
      background: #dc3545;
      color: white;
      border-color: #dc3545;
    }
  `]
})
export class UserManagementComponent {}