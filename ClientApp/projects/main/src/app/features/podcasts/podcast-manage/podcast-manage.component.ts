import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PodcastLayoutComponent } from '../podcast-layout/podcast-layout.component';
import { PodcastService, PodcastShow, EpisodeListItem, PodcastHost } from '../../../core/services/media/podcast.service';

@Component({
  selector: 'app-podcast-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PodcastLayoutComponent],
  template: `
    <app-podcast-layout>
      <div class="manage-page">
        <div class="page-header">
          <h1>Manage Podcast</h1>
          <a [routerLink]="['/podcasts/show', podcast?.slug || podcast?.id]" class="btn-view">View Public Page</a>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button [class.active]="activeTab === 'episodes'" (click)="activeTab = 'episodes'">Episodes</button>
          <button [class.active]="activeTab === 'settings'" (click)="activeTab = 'settings'">Settings</button>
          <button [class.active]="activeTab === 'analytics'" (click)="activeTab = 'analytics'">Analytics</button>
          <button [class.active]="activeTab === 'hosts'" (click)="activeTab = 'hosts'">Hosts</button>
        </div>

        <!-- Episodes Tab -->
        @if (activeTab === 'episodes') {
          <div class="tab-content">
            <div class="section-header">
              <h2>Episodes ({{ episodes.length }})</h2>
              <button (click)="showUploadModal = true" class="btn-primary">+ New Episode</button>
            </div>
            
            <div class="episodes-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th>Plays</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ep of episodes; track ep.id) {
                    <tr>
                      <td>{{ ep.episodeNumber }}</td>
                      <td>{{ ep.title }}</td>
                      <td><span class="status" [class.published]="ep.publishedAt">{{ ep.publishedAt ? 'Published' : 'Draft' }}</span></td>
                      <td>{{ ep.publishedAt | date:'shortDate' }}</td>
                      <td>{{ ep.playCount | number }}</td>
                      <td class="actions">
                        <button (click)="editEpisode(ep)">Edit</button>
                        @if (!ep.publishedAt) {
                          <button (click)="publishEpisode(ep)">Publish</button>
                        }
                        <button (click)="deleteEpisode(ep)" class="btn-danger">Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Settings Tab -->
        @if (activeTab === 'settings' && podcast) {
          <div class="tab-content">
            <form (ngSubmit)="saveSettings()" class="settings-form">
              <div class="form-group">
                <label>Title</label>
                <input type="text" [(ngModel)]="podcast.title" name="title" />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="podcast.description" name="description" rows="4"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Category</label>
                  <select [(ngModel)]="podcast.category" name="category">
                    <option value="Automotive">Automotive</option>
                    <option value="Technology">Technology</option>
                    <option value="News">News</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Language</label>
                  <select [(ngModel)]="podcast.language" name="language">
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">Save Changes</button>
              </div>
            </form>

            <div class="danger-zone">
              <h3>Danger Zone</h3>
              <button (click)="unpublishPodcast()" class="btn-warning">Unpublish Podcast</button>
              <button (click)="deletePodcast()" class="btn-danger">Delete Podcast</button>
            </div>
          </div>
        }

        <!-- Analytics Tab -->
        @if (activeTab === 'analytics') {
          <div class="tab-content">
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-value">{{ analytics.totalPlays | number }}</span>
                <span class="stat-label">Total Plays</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">{{ analytics.subscribers | number }}</span>
                <span class="stat-label">Subscribers</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">{{ analytics.avgRating | number:'1.1-1' }}</span>
                <span class="stat-label">Avg Rating</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">{{ analytics.totalDownloads | number }}</span>
                <span class="stat-label">Downloads</span>
              </div>
            </div>
            <p class="analytics-note">Full analytics available in the dashboard.</p>
          </div>
        }

        <!-- Hosts Tab -->
        @if (activeTab === 'hosts') {
          <div class="tab-content">
            <div class="section-header">
              <h2>Hosts</h2>
              <button (click)="addHost()" class="btn-primary">+ Add Host</button>
            </div>
            <div class="hosts-list">
              @for (host of hosts; track host.id) {
                <div class="host-card">
                  <img [src]="host.avatarUrl || '/assets/avatar-default.png'" class="host-avatar" />
                  <div class="host-info">
                    <h4>{{ host.name }}</h4>
                    @if (host.bio) { <p>{{ host.bio }}</p> }
                    @if (host.isPrimaryHost) {
                      <span class="badge">Primary Host</span>
                    }
                  </div>
                  <div class="host-actions">
                    <button (click)="editHost(host)">Edit</button>
                    <button (click)="removeHost(host)" class="btn-danger">Remove</button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Upload Episode Modal -->
        @if (showUploadModal) {
          <div class="modal-overlay" (click)="showUploadModal = false">
            <div class="modal" (click)="$event.stopPropagation()">
              <h2>Upload New Episode</h2>
              <form (ngSubmit)="uploadEpisode()">
                <div class="form-group">
                  <label>Title *</label>
                  <input type="text" [(ngModel)]="newEpisode.title" name="title" required />
                </div>
                <div class="form-group">
                  <label>Episode Number *</label>
                  <input type="number" [(ngModel)]="newEpisode.episodeNumber" name="episodeNumber" required />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea [(ngModel)]="newEpisode.description" name="description" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label>Audio File *</label>
                  <input type="file" (change)="selectAudioFile($event)" accept="audio/*" required />
                </div>
                <div class="form-actions">
                  <button type="button" (click)="showUploadModal = false">Cancel</button>
                  <button type="submit" class="btn-primary" [disabled]="uploading">
                    {{ uploading ? 'Uploading...' : 'Upload' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      </div>
    </app-podcast-layout>
  `,
  styles: [`
    .manage-page { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-view { padding: 0.5rem 1rem; background: white; border: 1px solid #ddd; border-radius: 6px; text-decoration: none; color: #333; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid #eee; }
    .tabs button { padding: 0.75rem 1.5rem; border: none; background: none; cursor: pointer; font-size: 1rem; }
    .tabs button.active { border-bottom: 2px solid #6366f1; color: #6366f1; margin-bottom: -2px; }
    .tab-content { background: white; border-radius: 12px; padding: 1.5rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .btn-primary { padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; }
    .btn-warning { padding: 0.5rem 1rem; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; }
    .btn-danger { padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; }

    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
    th { font-weight: 600; color: #666; }
    .status { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
    .status.published { background: #d1fae5; color: #065f46; }
    .status.draft { background: #fef3c7; color: #92400e; }
    .actions button { margin-right: 0.5rem; padding: 0.25rem 0.5rem; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer; }

    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; }
    .form-row { display: flex; gap: 1rem; }
    .form-row .form-group { flex: 1; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }

    .danger-zone { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #fee2e2; }
    .danger-zone h3 { color: #ef4444; margin-bottom: 1rem; }
    .danger-zone button { margin-right: 1rem; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem; }
    .stat-card { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: center; }
    .stat-value { display: block; font-size: 2rem; font-weight: bold; color: #6366f1; }
    .stat-label { color: #666; }
    .analytics-note { color: #666; text-align: center; }

    .hosts-list { display: flex; flex-direction: column; gap: 1rem; }
    .host-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px; }
    .host-avatar { width: 60px; height: 60px; border-radius: 50%; }
    .host-info { flex: 1; }
    .host-info h4 { margin: 0; }
    .host-info p { margin: 0.25rem 0; color: #666; }
    .badge { background: #6366f1; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
    .host-actions button { margin-left: 0.5rem; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 2rem; border-radius: 12px; width: 500px; max-width: 90%; }
    .modal h2 { margin: 0 0 1.5rem; }
  `]
})
export class PodcastManageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private podcastService = inject(PodcastService);

  podcast: PodcastShow | null = null;
  episodes: EpisodeListItem[] = [];
  hosts: PodcastHost[] = [];
  analytics = { totalPlays: 0, subscribers: 0, avgRating: 0, totalDownloads: 0 };
  activeTab = 'episodes';
  showUploadModal = false;
  uploading = false;
  newEpisode = { title: '', episodeNumber: 1, description: '' };
  audioFile: File | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => this.loadPodcast(params['id']));
  }

  loadPodcast(id: string) {
    this.podcastService.getPodcast(id).subscribe(p => {
      this.podcast = p;
      this.analytics = {
        totalPlays: p.totalPlays,
        subscribers: p.subscriberCount,
        avgRating: p.averageRating,
        totalDownloads: 0
      };
      this.hosts = p.hosts || [];
      this.loadEpisodes();
    });
  }

  loadEpisodes() {
    if (!this.podcast) return;
    this.podcastService.getEpisodes(this.podcast.id, 1, 100).subscribe(r => this.episodes = r.items);
  }

  saveSettings() {
    if (!this.podcast) return;
    this.podcastService.updatePodcast(this.podcast.id, {
      title: this.podcast.title,
      description: this.podcast.description,
      category: this.podcast.category
    }).subscribe();
  }

  selectAudioFile(event: any) {
    this.audioFile = event.target.files[0];
  }

  uploadEpisode() {
    if (!this.audioFile || !this.podcast) return;
    this.uploading = true;
    this.podcastService.initiateEpisodeUpload(this.podcast.id, {
      title: this.newEpisode.title,
      episodeNumber: this.newEpisode.episodeNumber,
      description: this.newEpisode.description,
      type: 0,
      explicitContent: 0,
      allowComments: true,
      allowDownloads: true
    }).subscribe({
      next: () => {
        this.showUploadModal = false;
        this.uploading = false;
        this.loadEpisodes();
      },
      error: () => this.uploading = false
    });
  }

  editEpisode(ep: EpisodeListItem) { console.log('Edit', ep); }
  
  publishEpisode(ep: EpisodeListItem) {
    if (!this.podcast) return;
    this.podcastService.publishEpisode(this.podcast.id, ep.id).subscribe(() => this.loadEpisodes());
  }
  
  deleteEpisode(ep: EpisodeListItem) {
    if (!this.podcast || !confirm('Delete this episode?')) return;
    this.podcastService.deleteEpisode(this.podcast.id, ep.id).subscribe(() => this.loadEpisodes());
  }

  addHost() { console.log('Add host'); }
  editHost(host: PodcastHost) { console.log('Edit host', host); }
  
  removeHost(host: PodcastHost) {
    if (!confirm('Remove this host?')) return;
    this.podcastService.removeHost(host.id).subscribe(() => {
      this.hosts = this.hosts.filter(h => h.id !== host.id);
    });
  }

  unpublishPodcast() {
    if (!this.podcast || !confirm('Unpublish this podcast?')) return;
    this.podcastService.unpublishPodcast(this.podcast.id).subscribe();
  }

  deletePodcast() {
    if (!this.podcast || !confirm('Delete this podcast? This cannot be undone.')) return;
    this.podcastService.deletePodcast(this.podcast.id).subscribe(() => {
      this.router.navigate(['/podcasts']);
    });
  }
}
