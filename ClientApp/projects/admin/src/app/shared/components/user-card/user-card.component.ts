import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUser } from '../../../core/interfaces/admin/users.interface';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lg:hidden space-y-4">
      @for (user of users(); track user.id) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-white font-semibold">
                {{ getInitials(user) }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                <div class="text-xs text-gray-500">{{ user.userName }}</div>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                (click)="edit.emit(user)"
                class="text-xs text-primary hover:text-primary-hover px-2 py-1 rounded transition-colors">
                Edit
              </button>
              <button
                *ngIf="user.accountStatus !== 'Active'"
                (click)="activate.emit(user)"
                class="text-xs text-green-600 hover:text-green-700 px-2 py-1 rounded transition-colors">
                Activate
              </button>
              <button
                *ngIf="user.accountStatus === 'Active'"
                (click)="block.emit(user)"
                class="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded transition-colors">
                Block
              </button>
            </div>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Email:</span>
              <span class="text-gray-900">{{ user.email }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-500">Roles:</span>
              <div class="flex flex-wrap gap-1 justify-end">
                <span
                  *ngFor="let role of user.roles"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="getRoleBadgeClass(role)">
                  {{ role }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-500">Status:</span>
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                [ngClass]="getStatusBadgeClass(user.accountStatus)">
                {{ user.accountStatus }}
              </span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-500">Joined:</span>
              <span class="text-gray-900">{{ user.createdAt | date : "mediumDate" }}</span>
            </div>
          </div>
        </div>
      }
      
      <div *ngIf="users().length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div class="text-6xl mb-4">👥</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
        <p class="text-sm text-gray-500">{{ emptyMessage() }}</p>
      </div>
    </div>
  `
})
export class UserCardComponent {
  users = input.required<AdminUser[]>();
  emptyMessage = input<string>('Try adjusting your search criteria');
  
  edit = output<AdminUser>();
  activate = output<AdminUser>();
  block = output<AdminUser>();

  getInitials(user: AdminUser): string {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }

  getRoleBadgeClass(role: any): string {
    const roleStr = typeof role === 'string' ? role : role.toString();
    const classes: Record<string, string> = {
      'SuperAdmin': 'bg-purple-100 text-purple-800',
      'UserAdmin': 'bg-blue-100 text-blue-800',
      'ContentAdmin': 'bg-indigo-100 text-indigo-800',
      'Expert': 'bg-green-100 text-green-800',
      'Reviewer': 'bg-yellow-100 text-yellow-800',
      'User': 'bg-gray-100 text-gray-800',
      '3': 'bg-purple-100 text-purple-800', // SuperAdmin enum value
      '2': 'bg-blue-100 text-blue-800',     // Admin enum value
      '1': 'bg-indigo-100 text-indigo-800', // Moderator enum value
      '0': 'bg-gray-100 text-gray-800'      // User enum value
    };
    return classes[roleStr] || 'bg-gray-100 text-gray-800';
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
