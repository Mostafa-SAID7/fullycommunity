import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoriesService, CreateStoryRequest, StoryType, StoryVisibility } from '../../../core/services/home/stories.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-create-story-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" (click)="close()">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Create Story</h2>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          
          <!-- Media Upload -->
          <div class="space-y-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Story Media</label>
            
            <!-- Upload Area -->
            <div 
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
              (click)="fileInput.click()"
              (dragover)="onDragOver($event)"
              (drop)="onDrop($event)"
            >
              <div *ngIf="!selectedFile() && !mediaPreview()" class="space-y-2">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="text-gray-600 dark:text-gray-400">
                  <p class="font-medium">Click to upload or drag and drop</p>
                  <p class="text-sm">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              <!-- Preview -->
              <div *ngIf="mediaPreview()" class="relative">
                <img [src]="mediaPreview()!" alt="Story preview" class="max-h-48 mx-auto rounded-lg">
                <button 
                  (click)="removeMedia($event)"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <input 
              #fileInput
              type="file" 
              accept="image/*,video/*" 
              (change)="onFileSelected($event)"
              class="hidden"
            >
          </div>

          <!-- Caption -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Caption</label>
            <textarea
              [(ngModel)]="caption"
              placeholder="Write a caption for your story..."
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            ></textarea>
          </div>

          <!-- Story Type -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Story Type</label>
            <select 
              [(ngModel)]="storyType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option [value]="StoryType.Image">Image</option>
              <option [value]="StoryType.Video">Video</option>
              <option [value]="StoryType.Text">Text</option>
            </select>
          </div>

          <!-- Visibility -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Who can see this?</label>
            <select 
              [(ngModel)]="visibility"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option [value]="StoryVisibility.Public">Everyone</option>
              <option [value]="StoryVisibility.Friends">Friends Only</option>
              <option [value]="StoryVisibility.CloseFriends">Close Friends</option>
              <option [value]="StoryVisibility.Private">Only Me</option>
            </select>
          </div>

          <!-- Text Story Options (if text type) -->
          <div *ngIf="storyType === StoryType.Text" class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Background Color</label>
              <div class="flex space-x-2">
                <button 
                  *ngFor="let color of backgroundColors" 
                  (click)="backgroundColor = color"
                  [class]="'w-8 h-8 rounded-full border-2 ' + (backgroundColor === color ? 'border-gray-800 dark:border-white' : 'border-gray-300')"
                  [style.background-color]="color"
                ></button>
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Text Color</label>
              <div class="flex space-x-2">
                <button 
                  *ngFor="let color of textColors" 
                  (click)="textColor = color"
                  [class]="'w-8 h-8 rounded-full border-2 ' + (textColor === color ? 'border-gray-800 dark:border-white' : 'border-gray-300')"
                  [style.background-color]="color"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            (click)="close()"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            (click)="createStory()"
            [disabled]="!canCreate() || creating()"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <span *ngIf="creating()" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span>{{ creating() ? 'Creating...' : 'Share Story' }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class CreateStoryModalComponent {
  private storiesService = inject(StoriesService);
  private authService = inject(AuthService);

  // Outputs
  storyCreated = output<void>();
  modalClosed = output<void>();

  // Form data
  selectedFile = signal<File | null>(null);
  mediaPreview = signal<string | null>(null);
  caption = '';
  storyType = StoryType.Image;
  visibility = StoryVisibility.Public;
  backgroundColor = '#6366f1';
  textColor = '#ffffff';
  
  // State
  creating = signal(false);

  // Constants
  StoryType = StoryType;
  StoryVisibility = StoryVisibility;
  
  backgroundColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
    '#f59e0b', '#10b981', '#06b6d4', '#6b7280'
  ];
  
  textColors = [
    '#ffffff', '#000000', '#374151', '#6b7280'
  ];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File) {
    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select an image or video file.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    this.selectedFile.set(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.mediaPreview.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Set story type based on file type
    if (file.type.startsWith('video/')) {
      this.storyType = StoryType.Video;
    } else {
      this.storyType = StoryType.Image;
    }
  }

  removeMedia(event: Event) {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.mediaPreview.set(null);
  }

  canCreate(): boolean {
    if (this.storyType === StoryType.Text) {
      return this.caption.trim().length > 0;
    }
    return this.selectedFile() !== null;
  }

  async createStory() {
    if (!this.canCreate() || this.creating()) return;

    this.creating.set(true);

    try {
      let mediaUrl = '';
      let thumbnailUrl = '';

      // Upload file if present
      if (this.selectedFile()) {
        // In a real app, you would upload to a file storage service
        // For now, we'll use a placeholder URL
        mediaUrl = this.mediaPreview() || '';
        thumbnailUrl = mediaUrl;
      }

      const request: CreateStoryRequest = {
        mediaUrl,
        thumbnailUrl,
        type: this.storyType,
        caption: this.caption.trim() || undefined,
        backgroundColor: this.storyType === StoryType.Text ? this.backgroundColor : undefined,
        textColor: this.storyType === StoryType.Text ? this.textColor : undefined,
        visibility: this.visibility,
        viewerIds: []
      };

      await this.storiesService.createStory(request).toPromise();
      
      this.storyCreated.emit();
      this.close();
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      this.creating.set(false);
    }
  }

  close() {
    this.modalClosed.emit();
  }
}