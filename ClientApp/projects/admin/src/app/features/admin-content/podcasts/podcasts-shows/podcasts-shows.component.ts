import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PodcastService } from '../../../../core/services/content/podcasts/podcast.service';
import { PodcastShow, PodcastShowsResponse } from '../../../../core/interfaces/content/podcasts/podcast.interface';

@Component({
  selector: 'app-podcasts-shows',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './podcasts-shows.component.html'
})
export class PodcastsShowsComponent implements OnInit {
  private podcastService: PodcastService = inject(PodcastService);
  
  shows = signal<PodcastShow[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 12;
  totalPages = signal(1);
  totalCount = signal(0);
  searchQuery = '';
  selectedStatus = '';

  ngOnInit() {
    this.loadShows();
  }

  loadShows() {
    this.loading.set(true);

    this.podcastService.getShows(
      this.currentPage(),
      this.pageSize,
      this.selectedStatus || undefined,
      this.searchQuery || undefined
    ).subscribe({
      next: (response: PodcastShowsResponse) => {
        this.shows.set(response.items);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading shows:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadShows();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.currentPage.set(1);
    this.loadShows();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadShows();
  }

  deleteShow(show: PodcastShow) {
    if (!confirm(`Delete podcast show "${show.title}"? This will also delete all episodes. This action cannot be undone.`)) return;

    this.podcastService.deleteShow(show.id).subscribe({
      next: () => this.loadShows(),
      error: (error: any) => console.error('Error deleting show:', error)
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
