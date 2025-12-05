import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LocalizationService } from '../../../core/services/ui/localization.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive, 
    LanguageSwitcherComponent,
    SearchBoxComponent
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  authService = inject(AuthService);
  localization = inject(LocalizationService);
  private router = inject(Router);

  showLanguageMenu = signal(false);
  showNotifications = signal(false);
  showUserMenu = signal(false);
  showSearchModal = signal(false);
  
  notifications = signal([
    { id: 1, title: 'New comment on your post', time: '2 min ago', read: false },
    { id: 2, title: 'Someone liked your review', time: '1 hour ago', read: false },
    { id: 3, title: 'New follower', time: '3 hours ago', read: true }
  ]);

  searchSuggestions = signal([
    { text: 'Toyota Camry 2023', count: 45 },
    { text: 'Honda Accord', count: 32 },
    { text: 'BMW 3 Series', count: 28 },
    { text: 'Car maintenance tips', count: 156 },
    { text: 'Electric vehicles', count: 89 }
  ]);

  get unreadCount() {
    return this.notifications().filter(n => !n.read).length;
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    this.showUserMenu.set(false);
    this.showSearchModal.set(false);
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
    this.showNotifications.set(false);
    this.showLanguageMenu.set(false);
    this.showSearchModal.set(false);
  }

  toggleSearchModal() {
    this.showSearchModal.update(v => !v);
    this.showNotifications.set(false);
    this.showUserMenu.set(false);
  }

  toggleLanguageMenu() {
    this.showLanguageMenu.update(v => !v);
    this.showNotifications.set(false);
    this.showUserMenu.set(false);
  }

  setLanguage(langCode: string) {
    this.localization.setLanguage(langCode);
    this.showLanguageMenu.set(false);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.showUserMenu.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const u = this.authService.currentUser();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }

  onSearch(term: string) {
    console.log('Searching for:', term);
    // Implement search logic here
    this.showSearchModal.set(false);
  }

  onSuggestionSelected(text: string) {
    console.log('Selected suggestion:', text);
    this.showSearchModal.set(false);
  }
}