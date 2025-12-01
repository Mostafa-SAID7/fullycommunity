import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-podcast-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="podcast-layout" [class.edit-mode]="isEditMode">
      <!-- Header -->
      <header class="podcast-header">
        <div class="header-left">
          <a routerLink="/podcasts" class="logo">🎧 Podcasts</a>
          <nav class="main-nav">
            <a routerLink="/podcasts" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/podcasts/browse" routerLinkActive="active">Browse</a>
            @if (isLoggedIn) {
              <a routerLink="/podcasts/library" routerLinkActive="active">Library</a>
            }
          </nav>
        </div>
        <div class="header-right">
          <div class="search-box">
            <input type="text" placeholder="Search podcasts..." [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" />
          </div>
          @if (isLoggedIn) {
            <div class="user-menu">
              <button class="user-btn" (click)="toggleUserMenu()">
                {{ userInitials }}
              </button>
              @if (showUserMenu) {
                <div class="dropdown-menu">
                  <a routerLink="/profile">Profile</a>
                  <a routerLink="/podcasts/library">My Library</a>
                  @if (canEdit) {
                    <a routerLink="/podcasts/create">Create Podcast</a>
                    <hr />
                    <button (click)="toggleEditMode()">
                      {{ isEditMode ? 'Exit Edit Mode' : 'Edit Layout' }}
                    </button>
                  }
                  <hr />
                  <button (click)="logout()">Logout</button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/login" class="btn btn-login">Sign In</a>
          }
        </div>
      </header>

      <!-- Edit Mode Toolbar -->
      @if (isEditMode && canEdit) {
        <div class="edit-toolbar">
          <span class="edit-indicator">✏️ Edit Mode</span>
          <div class="edit-actions">
            <button (click)="addSection()">+ Add Section</button>
            <button (click)="reorderSections()">Reorder</button>
            <button (click)="saveLayout()" class="btn-save">Save Changes</button>
            <button (click)="toggleEditMode()" class="btn-cancel">Cancel</button>
          </div>
        </div>
      }

      <!-- Main Content -->
      <main class="podcast-main">
        <ng-content></ng-content>
      </main>

      <!-- Mini Player -->
      @if (isLoggedIn && currentEpisode) {
        <div class="mini-player">
          <div class="player-info">
            <img [src]="currentEpisode.thumbnailUrl || '/assets/podcast-default.png'" alt="" />
            <div class="player-text">
              <span class="episode-title">{{ currentEpisode.title }}</span>
              <span class="podcast-title">{{ currentEpisode.podcastTitle }}</span>
            </div>
          </div>
          <div class="player-controls">
            <button (click)="skipBack()">⏪</button>
            <button (click)="togglePlay()" class="play-btn">{{ isPlaying ? '⏸️' : '▶️' }}</button>
            <button (click)="skipForward()">⏩</button>
          </div>
          <div class="player-progress">
            <input type="range" [value]="progress" (input)="seek($event)" min="0" max="100" />
            <span class="time">{{ currentTime }} / {{ duration }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .podcast-layout { min-height: 100vh; display: flex; flex-direction: column; }
    .podcast-layout.edit-mode { background: #f0f4ff; }

    .podcast-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 2rem; background: #1a1a2e; color: white;
    }
    .header-left { display: flex; align-items: center; gap: 2rem; }
    .logo { font-size: 1.25rem; font-weight: bold; color: white; text-decoration: none; }
    .main-nav { display: flex; gap: 1.5rem; }
    .main-nav a { color: rgba(255,255,255,0.8); text-decoration: none; }
    .main-nav a.active { color: white; font-weight: 600; }
    .header-right { display: flex; align-items: center; gap: 1rem; }
    .search-box input {
      padding: 0.5rem 1rem; border-radius: 20px; border: none;
      background: rgba(255,255,255,0.1); color: white; width: 250px;
    }
    .search-box input::placeholder { color: rgba(255,255,255,0.5); }
    .user-menu { position: relative; }
    .user-btn {
      width: 36px; height: 36px; border-radius: 50%; border: none;
      background: #6366f1; color: white; font-weight: bold; cursor: pointer;
    }
    .dropdown-menu {
      position: absolute; top: 100%; right: 0; background: white; color: #333;
      border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 180px; padding: 0.5rem 0; z-index: 100;
    }
    .dropdown-menu a, .dropdown-menu button {
      display: block; width: 100%; padding: 0.5rem 1rem; text-align: left;
      border: none; background: none; cursor: pointer; text-decoration: none; color: #333;
    }
    .dropdown-menu a:hover, .dropdown-menu button:hover { background: #f5f5f5; }
    .dropdown-menu hr { margin: 0.5rem 0; border: none; border-top: 1px solid #eee; }
    .btn-login { padding: 0.5rem 1rem; background: #6366f1; color: white; border-radius: 6px; text-decoration: none; }

    .edit-toolbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.75rem 2rem; background: #fef3c7; border-bottom: 2px solid #f59e0b;
    }
    .edit-indicator { font-weight: 600; color: #92400e; }
    .edit-actions { display: flex; gap: 0.5rem; }
    .edit-actions button { padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #d97706; background: white; cursor: pointer; }
    .edit-actions .btn-save { background: #10b981; color: white; border-color: #10b981; }
    .edit-actions .btn-cancel { background: #ef4444; color: white; border-color: #ef4444; }

    .podcast-main { flex: 1; padding: 2rem; max-width: 1400px; margin: 0 auto; width: 100%; }

    .mini-player {
      position: fixed; bottom: 0; left: 0; right: 0;
      display: flex; align-items: center; gap: 1rem;
      padding: 0.75rem 2rem; background: #1a1a2e; color: white;
    }
    .player-info { display: flex; align-items: center; gap: 0.75rem; flex: 0 0 250px; }
    .player-info img { width: 48px; height: 48px; border-radius: 4px; }
    .player-text { display: flex; flex-direction: column; }
    .episode-title { font-weight: 500; font-size: 0.9rem; }
    .podcast-title { font-size: 0.8rem; opacity: 0.7; }
    .player-controls { display: flex; align-items: center; gap: 0.5rem; }
    .player-controls button { background: none; border: none; font-size: 1.25rem; cursor: pointer; }
    .play-btn { font-size: 1.5rem; }
    .player-progress { flex: 1; display: flex; align-items: center; gap: 1rem; }
    .player-progress input { flex: 1; }
    .time { font-size: 0.8rem; opacity: 0.7; }
  `]
})
export class PodcastLayoutComponent {
  @Input() canEdit = false;

  private authService = inject(AuthService);

  isLoggedIn = false;
  isEditMode = false;
  showUserMenu = false;
  searchQuery = '';
  currentEpisode: any = null;
  isPlaying = false;
  progress = 0;
  currentTime = '0:00';
  duration = '0:00';

  get userInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  toggleUserMenu() { this.showUserMenu = !this.showUserMenu; }
  toggleEditMode() { this.isEditMode = !this.isEditMode; }

  onSearch() {
    if (this.searchQuery.trim()) {
      window.location.href = `/podcasts/browse?q=${encodeURIComponent(this.searchQuery)}`;
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/podcasts';
  }

  // Edit mode actions
  addSection() { console.log('Add section'); }
  reorderSections() { console.log('Reorder sections'); }
  saveLayout() { console.log('Save layout'); this.isEditMode = false; }

  // Player controls
  togglePlay() { this.isPlaying = !this.isPlaying; }
  skipBack() { console.log('Skip back 15s'); }
  skipForward() { console.log('Skip forward 30s'); }
  seek(event: any) { this.progress = event.target.value; }
}
