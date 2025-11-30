import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PodcastLayoutComponent } from '../shared/podcast-layout/podcast-layout.component';

@Component({
  selector: 'app-podcast-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PodcastLayoutComponent],
  template: `
    <app-podcast-layout>
      <div class="create-page">
        <h1>Create New Podcast</h1>
        
        <form (ngSubmit)="create()" class="create-form">
          <div class="form-section">
            <h2>Basic Information</h2>
            
            <div class="form-group">
              <label>Podcast Title *</label>
              <input type="text" [(ngModel)]="podcast.title" name="title" required placeholder="Enter podcast title" />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="podcast.description" name="description" rows="4" placeholder="Describe your podcast"></textarea>
            </div>

            <div class="form-group">
              <label>Summary</label>
              <input type="text" [(ngModel)]="podcast.summary" name="summary" placeholder="Short summary for listings" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category *</label>
                <select [(ngModel)]="podcast.category" name="category" required>
                  <option value="">Select category</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Technology">Technology</option>
                  <option value="News">News</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Business">Business</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div class="form-group">
                <label>Type</label>
                <select [(ngModel)]="podcast.type" name="type">
                  <option value="Audio">Audio Only</option>
                  <option value="Video">Video</option>
                  <option value="AudioVideo">Audio & Video</option>
                </select>
              </div>

              <div class="form-group">
                <label>Language</label>
                <select [(ngModel)]="podcast.language" name="language">
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Cover Image</h2>
            <div class="cover-upload">
              @if (podcast.coverImageUrl) {
                <img [src]="podcast.coverImageUrl" alt="Cover" class="cover-preview" />
              }
              <input type="file" (change)="uploadCover($event)" accept="image/*" />
              <p class="hint">Recommended: 1400x1400 pixels, JPG or PNG</p>
            </div>
          </div>

          <div class="form-section">
            <h2>Settings</h2>
            
            <div class="form-row">
              <label class="checkbox">
                <input type="checkbox" [(ngModel)]="podcast.allowComments" name="allowComments" />
                Allow comments on episodes
              </label>

              <label class="checkbox">
                <input type="checkbox" [(ngModel)]="podcast.allowDownloads" name="allowDownloads" />
                Allow episode downloads
              </label>
            </div>

            <div class="form-group">
              <label>Content Rating</label>
              <select [(ngModel)]="podcast.explicitContent" name="explicitContent">
                <option value="Clean">Clean (All ages)</option>
                <option value="Explicit">Explicit (Adult content)</option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h2>External Links (Optional)</h2>
            
            <div class="form-group">
              <label>Website URL</label>
              <input type="url" [(ngModel)]="podcast.websiteUrl" name="websiteUrl" placeholder="https://..." />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Apple Podcasts</label>
                <input type="url" [(ngModel)]="podcast.applePodcastsUrl" name="applePodcastsUrl" placeholder="Apple Podcasts URL" />
              </div>
              <div class="form-group">
                <label>Spotify</label>
                <input type="url" [(ngModel)]="podcast.spotifyUrl" name="spotifyUrl" placeholder="Spotify URL" />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/podcasts" class="btn-cancel">Cancel</a>
            <button type="submit" [disabled]="creating" class="btn-create">
              {{ creating ? 'Creating...' : 'Create Podcast' }}
            </button>
          </div>
        </form>
      </div>
    </app-podcast-layout>
  `,
  styles: [`
    .create-page { max-width: 800px; margin: 0 auto; }
    .create-page h1 { margin-bottom: 2rem; }
    .form-section { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .form-section h2 { font-size: 1.1rem; margin: 0 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem;
    }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-row .form-group { flex: 1; min-width: 200px; }
    .checkbox { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .checkbox input { width: auto; }
    .cover-upload { text-align: center; padding: 2rem; border: 2px dashed #ddd; border-radius: 8px; }
    .cover-preview { width: 200px; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem; }
    .hint { color: #666; font-size: 0.85rem; margin-top: 0.5rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; }
    .btn-cancel { padding: 0.75rem 1.5rem; background: white; border: 1px solid #ddd; border-radius: 8px; text-decoration: none; color: #333; }
    .btn-create { padding: 0.75rem 2rem; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; }
    .btn-create:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class PodcastCreateComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  creating = false;
  podcast = {
    title: '',
    description: '',
    summary: '',
    category: '',
    type: 'Audio',
    language: 'en',
    coverImageUrl: '',
    allowComments: true,
    allowDownloads: true,
    explicitContent: 'Clean',
    websiteUrl: '',
    applePodcastsUrl: '',
    spotifyUrl: ''
  };

  uploadCover(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    // Upload to server and get URL
    const formData = new FormData();
    formData.append('file', file);
    this.http.post<{ url: string }>(`${environment.apiUrl}/upload`, formData)
      .subscribe(res => this.podcast.coverImageUrl = res.url);
  }

  create() {
    if (!this.podcast.title || !this.podcast.category) return;
    this.creating = true;
    this.http.post<any>(`${environment.apiUrl}/podcasts`, this.podcast)
      .subscribe({
        next: (result) => this.router.navigate(['/podcasts/manage', result.id]),
        error: () => this.creating = false
      });
  }
}
