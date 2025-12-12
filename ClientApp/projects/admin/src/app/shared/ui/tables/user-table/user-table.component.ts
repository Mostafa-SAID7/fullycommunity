import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUser } from '../../../../core/interfaces/admin/users.interface';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
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

  getRoleBadgeClass(role: any): string {
    const roleStr = typeof role === 'string' ? role : role.toString();
    const classes: Record<string, string> = {
      'SuperAdmin': 'role-super-admin',
      'UserAdmin': 'role-user-admin',
      'ContentAdmin': 'role-content-admin',
      'Expert': 'role-expert',
      'Reviewer': 'role-reviewer',
      'User': 'role-user',
      '3': 'role-super-admin', // SuperAdmin enum value
      '2': 'role-user-admin',  // Admin enum value
      '1': 'role-content-admin', // Moderator enum value
      '0': 'role-user'         // User enum value
    };
    return classes[roleStr] || 'role-user';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'Active': 'status-active',
      'Inactive': 'status-inactive',
      'Banned': 'status-banned',
      'PendingApproval': 'status-pending'
    };
    return classes[status] || 'status-inactive';
  }
}
