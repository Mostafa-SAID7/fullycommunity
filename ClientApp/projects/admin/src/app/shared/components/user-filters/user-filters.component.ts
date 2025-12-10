import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-filters.component.html',
  styleUrl: './user-filters.component.scss'
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
