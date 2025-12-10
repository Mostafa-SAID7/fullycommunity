import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUsersService } from '../../../core/services/admin/users.service';
import { AdminUser } from '../../../core/interfaces/admin/users.interface';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserTableComponent } from '../../../shared/components/user-table/user-table.component';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';
import { UserFiltersComponent } from '../../../shared/components/user-filters/user-filters.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CreateUserModalComponent, NewUser } from '../../../shared/components/create-user-modal/create-user-modal.component';

@Component({
  selector: 'user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserTableComponent,
    UserCardComponent,
    UserFiltersComponent,
    PaginationComponent,
    CreateUserModalComponent
  ],
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  users = signal<AdminUser[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 1;
  
  showCreateModal = false;
  createStep = signal<'select-type' | 'form'>('select-type');
  selectedUserType = signal<'user' | 'admin'>('user');
  newUser = signal<NewUser>({ email: '', firstName: '', lastName: '', password: '', roleType: 'User' });
  creating = signal(false);
  createError = signal<string>('');
  createSuccess = signal(false);
  
  // Role options based on user type
  userRoles = ['User', 'Expert', 'Reviewer', 'Vendor', 'Mechanic', 'GarageOwner'];
  adminRoles = ['Moderator', 'ContentAdmin', 'UserAdmin', 'Admin', 'SuperAdmin'];
  
  Math = Math;
  private authService = inject(AuthService);
  private usersService = inject(AdminUsersService);

  isSuperAdmin(): boolean {
    return this.authService.hasRole('SuperAdmin');
  }

  selectUserType(type: 'user' | 'admin') {
    this.selectedUserType.set(type);
    const roleType = type === 'user' ? 'User' : 'Moderator';
    this.newUser.set({ ...this.newUser(), roleType });
    this.createStep.set('form');
  }

  goBackToTypeSelection() {
    this.createStep.set('select-type');
    this.selectedUserType.set('user');
    this.createError.set('');
  }

  getCurrentRoles(): string[] {
    return this.selectedUserType() === 'admin' ? this.adminRoles : this.userRoles;
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.onSearch();
  }

  onRoleChange(role: string) {
    this.selectedRole = role;
    this.loadUsers();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.loadUsers();
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);
    
    this.usersService.getUsers(this.currentPage, this.pageSize, this.searchTerm, this.selectedRole, this.selectedStatus)
      .subscribe({
        next: (response) => {
          this.users.set(response.items || []);
          this.totalCount = response.totalCount || 0;
          this.totalPages = response.totalPages || 1;
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load users. Please try again.');
          this.loading.set(false);
          console.error('Error loading users:', err);
        }
      });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  getInitials(user: AdminUser): string {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }

  getRoleBadgeClass(role: string): string {
    const classes: Record<string, string> = {
      'SuperAdmin': 'role-super-admin',
      'UserAdmin': 'role-user-admin',
      'ContentAdmin': 'role-content-admin',
      'Expert': 'role-expert',
      'Reviewer': 'role-reviewer',
      'User': 'role-user'
    };
    return classes[role] || 'role-user';
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

  editUser(user: AdminUser) {
    console.log('Edit user:', user);
  }

  activateUser(user: AdminUser) {
    this.usersService.activateUser(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error activating user:', err)
    });
  }

  blockUser(user: AdminUser) {
    const reason = prompt('Reason for blocking this user:') || 'Blocked by admin';
    if (reason && confirm(`Are you sure you want to block ${user.firstName} ${user.lastName}?`)) {
      this.usersService.blockUser(user.id, reason).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error blocking user:', err)
      });
    }
  }

  createUser(user: NewUser) {
    this.creating.set(true);
    this.createError.set('');
    
    this.usersService.createUser(user).subscribe({
      next: () => {
        this.creating.set(false);
        this.createSuccess.set(true);
        setTimeout(() => {
          this.showCreateModal = false;
          this.createSuccess.set(false);
          this.newUser.set({ email: '', firstName: '', lastName: '', password: '', roleType: 'User' });
          this.loadUsers();
        }, 1500);
      },
      error: (err) => {
        this.creating.set(false);
        this.createError.set(err.error?.message || 'Failed to create user');
        console.error('Error creating user:', err);
      }
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.createStep.set('select-type');
    this.selectedUserType.set('user');
    this.createError.set('');
    this.createSuccess.set(false);
    this.newUser.set({ email: '', firstName: '', lastName: '', password: '', roleType: 'User' });
  }

  closeModal() {
    this.showCreateModal = false;
    this.createStep.set('select-type');
    this.selectedUserType.set('user');
    this.createError.set('');
    this.createSuccess.set(false);
  }
}
