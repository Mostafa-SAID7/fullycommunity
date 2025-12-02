import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupsService, Group } from '../../../core/services/groups.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="groups-page">
      <div class="page-header">
        <h1>Groups</h1>
        <button class="create-btn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Create Group
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab() === 'your'" (click)="activeTab.set('your')">Your Groups</button>
        <button class="tab" [class.active]="activeTab() === 'discover'" (click)="activeTab.set('discover')">Discover</button>
      </div>

      <!-- Groups Grid -->
      <div class="groups-grid">
        @for (group of filteredGroups(); track group.id) {
          <div class="group-card">
            <div class="group-cover" [style.background-image]="group.coverImageUrl ? 'url(' + group.coverImageUrl + ')' : ''">
              <div class="cover-fallback">{{ group.name.charAt(0) }}</div>
            </div>
            <div class="group-info">
              <h3>{{ group.name }}</h3>
              <p class="group-meta">
                <span class="privacy">{{ group.privacy === 'Public' ? '🌍 Public' : '🔒 Private' }}</span>
                · {{ group.memberCount | number }} members
              </p>
              <p class="group-desc">{{ group.description }}</p>
              <button class="join-btn" [class.joined]="group.isJoined" (click)="toggleJoin(group)">
                {{ group.isJoined ? 'Joined ✓' : 'Join Group' }}
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .groups-page { padding: 1rem 0; }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      
      h1 { margin: 0; font-size: 1.5rem; }
    }
    
    .create-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: #1877f2;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      
      svg { width: 20px; height: 20px; }
      &:hover { background: #166fe5; }
    }
    
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .tab {
      padding: 0.625rem 1rem;
      border: none;
      background: #e4e6eb;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      
      &.active { background: #e7f3ff; color: #1877f2; }
      &:hover:not(.active) { background: #d8dadf; }
    }
    
    .groups-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    
    .group-card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .group-cover {
      height: 120px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .cover-fallback {
        font-size: 3rem;
        font-weight: 700;
        color: rgba(255,255,255,0.5);
      }
    }
    
    .group-info {
      padding: 1rem;
      
      h3 { margin: 0 0 0.25rem; font-size: 1rem; }
      
      .group-meta {
        margin: 0;
        font-size: 0.85rem;
        color: #65676b;
        
        .privacy { font-size: 0.8rem; }
      }
      
      .group-desc {
        margin: 0.25rem 0 0.75rem;
        font-size: 0.8rem;
        color: #65676b;
      }
    }
    
    .join-btn {
      width: 100%;
      padding: 0.5rem;
      border: none;
      background: #e7f3ff;
      color: #1877f2;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      
      &:hover { background: #d8ebff; }
      &.joined { background: #e4e6eb; color: #65676b; }
    }
  `]
})
export class GroupsComponent implements OnInit {
  private groupsService = inject(GroupsService);
  
  activeTab = signal<'your' | 'discover'>('your');
  groups = this.groupsService.groups;
  loading = this.groupsService.loading;

  ngOnInit() {
    this.groupsService.loadGroups();
  }

  filteredGroups() {
    return this.activeTab() === 'your' 
      ? this.groups().filter(g => g.isJoined)
      : this.groups().filter(g => !g.isJoined);
  }

  toggleJoin(group: Group) {
    if (group.isJoined) {
      this.groupsService.leaveGroup(group.id).subscribe(() => {
        this.groupsService.groups.update(groups => 
          groups.map(g => g.id === group.id ? { ...g, isJoined: false } : g)
        );
      });
    } else {
      this.groupsService.joinGroup(group.id).subscribe(() => {
        this.groupsService.groups.update(groups => 
          groups.map(g => g.id === group.id ? { ...g, isJoined: true } : g)
        );
      });
    }
  }
}
