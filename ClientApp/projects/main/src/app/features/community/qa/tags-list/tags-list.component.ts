import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QAService } from '../../../../core/services/community/qa.service';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

interface TagInfo {
  name: string;
  count: number;
  description?: string;
}

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingStateComponent],
  templateUrl: './tags-list.component.html'
})
export class TagsListComponent implements OnInit {
  private router = inject(Router);
  private qaService = inject(QAService);

  // State
  tags = signal<TagInfo[]>([]);
  filteredTags = signal<TagInfo[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');
  sortBy = signal<'name' | 'popular'>('popular');

  // Popular tags with descriptions
  popularTagsData: TagInfo[] = [
    { name: 'maintenance', count: 0, description: 'Regular car maintenance and service questions' },
    { name: 'electric', count: 0, description: 'Electric vehicles and EV-related topics' },
    { name: 'brakes', count: 0, description: 'Brake system issues and repairs' },
    { name: 'engine', count: 0, description: 'Engine problems and diagnostics' },
    { name: 'oil-change', count: 0, description: 'Oil change procedures and recommendations' },
    { name: 'tires', count: 0, description: 'Tire selection, maintenance, and issues' },
    { name: 'battery', count: 0, description: 'Car battery problems and replacements' },
    { name: 'transmission', count: 0, description: 'Transmission issues and repairs' },
    { name: 'suspension', count: 0, description: 'Suspension system and ride quality' },
    { name: 'diagnostics', count: 0, description: 'Diagnostic tools and error codes' },
    { name: 'hybrid', count: 0, description: 'Hybrid vehicle questions' },
    { name: 'tesla', count: 0, description: 'Tesla-specific questions' },
    { name: 'bmw', count: 0, description: 'BMW vehicles' },
    { name: 'mercedes', count: 0, description: 'Mercedes-Benz vehicles' },
    { name: 'toyota', count: 0, description: 'Toyota vehicles' },
    { name: 'honda', count: 0, description: 'Honda vehicles' }
  ];

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.loading.set(true);
    this.error.set(null);

    // Load question counts for each tag
    const tagPromises = this.popularTagsData.map(tag =>
      this.qaService.getQuestions({ tag: tag.name, sortBy: 'newest' }).toPromise()
        .then(result => ({
          ...tag,
          count: result?.totalCount || 0
        }))
        .catch(() => ({ ...tag, count: 0 }))
    );

    Promise.all(tagPromises).then(tagsWithCounts => {
      this.tags.set(tagsWithCounts);
      this.filterAndSortTags();
      this.loading.set(false);
    }).catch(err => {
      console.error('Failed to load tags:', err);
      this.error.set('Failed to load tags. Please try again.');
      this.loading.set(false);
    });
  }

  filterAndSortTags() {
    let filtered = this.tags();

    // Apply search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(search) ||
        tag.description?.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    if (this.sortBy() === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = [...filtered].sort((a, b) => b.count - a.count);
    }

    this.filteredTags.set(filtered);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.filterAndSortTags();
  }

  onSortChange(sort: 'name' | 'popular') {
    this.sortBy.set(sort);
    this.filterAndSortTags();
  }

  navigateToTag(tag: string) {
    this.router.navigate(['/community/qa/tag', tag]);
  }

  goBack() {
    this.router.navigate(['/community/qa']);
  }
}
