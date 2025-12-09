import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="search.emit(searchTerm())"
          [placeholder]="searchPlaceholder()"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <select 
          [(ngModel)]="selectedRole" 
          (change)="roleChange.emit(selectedRole())" 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
          <option value="">All Roles</option>
          <option *ngFor="let role of roles()" [value]="role">{{ role }}</option>
        </select>
        <select 
          [(ngModel)]="selectedStatus" 
          (change)="statusChange.emit(selectedStatus())" 
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
          <option value="">All Status</option>
          <option *ngFor="let status of statuses()" [value]="status">{{ status }}</option>
        </select>
      </div>
    </div>
  `
})
export class UserFiltersComponent {
  searchPlaceholder = input<string>('Search users...');
  roles = input<string[]>(['SuperAdmin', 'UserAdmin', 'ContentAdmin', 'Expert', 'Reviewer', 'User']);
  statuses = input<string[]>(['Active', 'Inactive', 'Banned', 'PendingApproval']);
  
  searchTerm = model<string>('');
  selectedRole = model<string>('');
  selectedStatus = model<string>('');
  
  search = output<string>();
  roleChange = output<string>();
  statusChange = output<string>();
}
