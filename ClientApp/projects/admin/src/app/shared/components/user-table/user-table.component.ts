import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUser } from '../../../core/interfaces/admin/users.interface';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let user of users()" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-semibold">
                  {{ getInitials(user) }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-sm text-gray-500">{{ user.userName }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span
                  *ngFor="let role of user.roles"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="getRoleBadgeClass(role)">
                  {{ role }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                [ngClass]="getStatusBadgeClass(user.accountStatus)">
                {{ user.accountStatus }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.createdAt | date : "mediumDate" }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-2">
                <button 
                  (click)="edit.emit(user)"
                  class="text-primary hover:text-primary-hover transition-colors">
                  Edit
                </button>
                <button
                  *ngIf="user.accountStatus !== 'Active'"
                  (click)="activate.emit(user)"
                  class="text-green-600 hover:text-green-700 transition-colors">
                  Activate
                </button>
                <button
                  *ngIf="user.accountStatus === 'Active'"
                  (click)="block.emit(user)"
                  class="text-red-600 hover:text-red-700 transition-colors">
                  Block
                </button>
              </div>
            </td>
          </tr>
          <tr *ngIf="users().length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              {{ emptyMessage() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class UserTableComponent {
  users = input.required<AdminUser[]>();
  emptyMessage = input<string>('No users found matching your criteria');
  
  edit = output<AdminUser>();
  activate = output<AdminUser>();
  block = output<AdminUser>();

  getInitials(user: AdminUser): string {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }

  getRoleBadgeClass(role: string): string {
    const classes: Record<string, string> = {
      'SuperAdmin': 'bg-purple-100 text-purple-800',
      'UserAdmin': 'bg-blue-100 text-blue-800',
      'ContentAdmin': 'bg-indigo-100 text-indigo-800',
      'Expert': 'bg-green-100 text-green-800',
      'Reviewer': 'bg-yellow-100 text-yellow-800',
      'User': 'bg-gray-100 text-gray-800'
    };
    return classes[role] || 'bg-gray-100 text-gray-800';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Banned': 'bg-red-100 text-red-800',
      'PendingApproval': 'bg-yellow-100 text-yellow-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }
}
