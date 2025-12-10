/**
 * Videos Admin Component
 * Comprehensive video management for administrators
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';


import { VideoAdminService } from '../../../core/services/content/videos/video-admin.service';
import {
  VideoAdmin,
  VideoStats,
  VideoCategory
} from '../../../core/interfaces/content/videos/components/video-core';
import {
  VideoStatus,
  AgeRating,
  ModerationAction
} from '../../../core/interfaces/content/videos/enums/video-enums';
import { DateUtils } from '../../../core/utils/date.utils';

@Component({
  selector: 'app-videos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './videos-admin.component.html',
  styleUrl: './videos-admin.component.scss'
})
export class VideosAdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Form and data
  filterForm!: FormGroup;
  videos: VideoAdmin[] = [];
  categories: VideoCategory[] = [];
  videoStats: VideoStats | null = null;
  processingVideos: VideoAdmin[] = [];
  
  // Selection and pagination
  selectedVideos: string[] = [];
  allSelected = false;
  currentPage = 1;
  pageSize = 20;
  totalVideos = 0;
  totalPages = 0;
  
  // UI state
  loading = false;
  refreshing = false;
  showAdvancedFilters = false;
  viewMode: 'table' | 'grid' = 'table';
  
  // Filter options
  statusOptions: any[] = [];
  durationOptions: any[] = [];
  qualityOptions: any[] = [];
  monetizationOptions: any[] = [];
  ageRatingOptions: any[] = [];
  
  // Bulk actions
  bulkActions: any[] = [];
  
  // Enums for template
  VideoStatus = VideoStatus;
  ModerationAction = ModerationAction;

  constructor(
    private fb: FormBuilder,
    private videoAdminService: VideoAdminService
  ) {
    this.initializeForm();
    this.initializeOptions();
    this.initializeBulkActions();
  }

  ngOnInit() {
    this.initializeFilters();
    this.loadVideoStats();
    this.loadCategories();
    this.loadVideos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeFilters() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadVideos();
      });
  }

  private loadVideoStats() {
    this.videoAdminService.getVideoStats().subscribe({
      next: (stats) => this.videoStats = stats,
      error: (error) => console.error('Error loading video stats:', error)
    });
  }

  private loadCategories() {
    this.videoAdminService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  private loadVideos() {
    this.loading = true;
    const filter = {
      ...this.filterForm.value,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.videoAdminService.getVideos(filter).subscribe({
      next: (response) => {
        this.videos = response.data;
        this.totalVideos = response.total;
        this.totalPages = Math.ceil(this.totalVideos / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        this.loading = false;
      }
    });
  }

  formatDuration = DateUtils.formatDuration;

  getStatusText(status: VideoStatus): string {
    return VideoStatus[status] || status.toString();
  }

  clearFilters() {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadVideos();
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadVideos();
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;
    if (this.allSelected) {
      this.selectedVideos = this.videos.map(v => v.id);
    } else {
      this.selectedVideos = [];
    }
  }

  toggleSelection(videoId: string, event: any) {
    if (event.target.checked) {
      this.selectedVideos.push(videoId);
    } else {
      this.selectedVideos = this.selectedVideos.filter(id => id !== videoId);
    }
    this.allSelected = this.selectedVideos.length === this.videos.length;
  }

  isSelected(videoId: string): boolean {
    return this.selectedVideos.includes(videoId);
  }

  approveVideo(video: any) {
    this.videoAdminService.approveVideo(video.id).subscribe({
      next: () => this.loadVideos(),
      error: (error) => console.error('Error approving video:', error)
    });
  }

  flagVideo(video: any) {
    this.videoAdminService.flagVideo(video.id, 'Flagged by admin').subscribe({
      next: () => this.loadVideos(),
      error: (error) => console.error('Error flagging video:', error)
    });
  }

  removeVideo(video: any) {
    if (confirm(`Are you sure you want to remove "${video.title}"?`)) {
      this.videoAdminService.removeVideo(video.id, 'Removed by admin').subscribe({
        next: () => this.loadVideos(),
        error: (error) => console.error('Error removing video:', error)
      });
    }
  }

  approveSelected() {
    if (this.selectedVideos.length === 0) return;
    
    this.videoAdminService.performBulkAction({
      videoIds: this.selectedVideos,
      action: ModerationAction.Approve,
      reason: 'Bulk approved by admin',
      notifyCreators: true
    }).subscribe({
      next: () => {
        this.selectedVideos = [];
        this.allSelected = false;
        this.loadVideos();
      },
      error: (error) => console.error('Error approving videos:', error)
    });
  }

  flagSelected() {
    if (this.selectedVideos.length === 0) return;
    
    this.videoAdminService.performBulkAction({
      videoIds: this.selectedVideos,
      action: ModerationAction.Flag,
      reason: 'Bulk flagged by admin',
      notifyCreators: true
    }).subscribe({
      next: () => {
        this.selectedVideos = [];
        this.allSelected = false;
        this.loadVideos();
      },
      error: (error) => console.error('Error flagging videos:', error)
    });
  }

  removeSelected() {
    if (this.selectedVideos.length === 0) return;
    
    if (confirm(`Are you sure you want to remove ${this.selectedVideos.length} videos?`)) {
      this.videoAdminService.performBulkAction({
        videoIds: this.selectedVideos,
        action: ModerationAction.Remove,
        reason: 'Bulk removed by admin',
        notifyCreators: true
      }).subscribe({
        next: () => {
          this.selectedVideos = [];
          this.allSelected = false;
          this.loadVideos();
        },
        error: (error) => console.error('Error removing videos:', error)
      });
    }
  }

  viewVideo(video: any) {
    // Open video details modal or navigate to detail page
    console.log('View video:', video);
  }

  exportVideos() {
    const filter = {
      ...this.filterForm.value
    };
    this.videoAdminService.exportVideos({
      filter,
      format: 'excel'
    }).subscribe({
      next: () => console.log('Export started'),
      error: (error) => console.error('Error exporting videos:', error)
    });
  }

  openBulkActions() {
    // Open bulk actions modal
    console.log('Open bulk actions');
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVideos();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
      category: [''],
      creator: [''],
      dateFrom: [''],
      dateTo: [''],
      duration: [''],
      quality: [''],
      monetization: ['']
    });
  }

  private initializeOptions(): void {
    this.statusOptions = [
      { value: VideoStatus.Active, label: 'Active' },
      { value: VideoStatus.Pending, label: 'Pending' },
      { value: VideoStatus.Flagged, label: 'Flagged' },
      { value: VideoStatus.Removed, label: 'Removed' },
      { value: VideoStatus.Archived, label: 'Archived' }
    ];

    this.durationOptions = [
      { value: 'short', label: 'Short (< 4 min)' },
      { value: 'medium', label: 'Medium (4-20 min)' },
      { value: 'long', label: 'Long (> 20 min)' }
    ];

    this.qualityOptions = [
      { value: '720p', label: '720p HD' },
      { value: '1080p', label: '1080p Full HD' },
      { value: '4k', label: '4K Ultra HD' }
    ];

    this.monetizationOptions = [
      { value: 'enabled', label: 'Monetized' },
      { value: 'disabled', label: 'Not Monetized' }
    ];

    this.ageRatingOptions = [
      { value: AgeRating.General, label: 'General' },
      { value: AgeRating.Teen, label: 'Teen' },
      { value: AgeRating.Mature, label: 'Mature' },
      { value: AgeRating.Adult, label: 'Adult' }
    ];
  }

  private initializeBulkActions(): void {
    this.bulkActions = [
      { id: 'approve', label: 'Approve Selected', icon: 'check', action: () => this.approveSelected() },
      { id: 'flag', label: 'Flag Selected', icon: 'flag', action: () => this.flagSelected() },
      { id: 'remove', label: 'Remove Selected', icon: 'trash', action: () => this.removeSelected() },
      { id: 'export', label: 'Export Selected', icon: 'download', action: () => this.exportVideos() }
    ];
  }
}