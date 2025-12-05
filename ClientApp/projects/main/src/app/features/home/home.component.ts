import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommunityService, Post, PostCategory } from '../../core/services/community/community.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { QAService, QuestionListItem } from '../../core/services/community/qa.service';
import { StoriesComponent } from './components/stories/stories.component';
import { SidebarLayoutComponent } from '../../shared/components/sidebar-layout/sidebar-layout.component';
import { type SidebarMenuItem, type SidebarShortcut } from '../../shared/components/left-sidebar/left-sidebar.component';
import { type SponsoredItem, type EventReminder, type Contact } from '../../shared/components/right-sidebar/right-sidebar.component';

export interface CommunityStats {
  members: number;
  posts: number;
  experts: number;
  garages: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, StoriesComponent, SidebarLayoutComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private communityService = inject(CommunityService);
  private qaService = inject(QAService);
  private authService = inject(AuthService);

  user = this.authService.currentUser;
  featuredPosts = signal<Post[]>([]);
  suggestedQuestions = signal<QuestionListItem[]>([]);
  categories = signal<PostCategory[]>([]);
  loading = signal(true);

  stats = signal<CommunityStats>({
    members: 12500,
    posts: 45000,
    experts: 350,
    garages: 1200
  });

  // Computed properties
  isAuthenticated = computed(() => !!this.user());
  hasContent = computed(() => 
    this.featuredPosts().length > 0 || this.suggestedQuestions().length > 0
  );

  // Sidebar configuration
  leftMenuItems: SidebarMenuItem[] = [
    { icon: 'home', label: 'Home', route: '/', exact: true },
    { icon: 'feed', label: 'Community', route: '/community' },
    { icon: 'marketplace', label: 'Marketplace', route: '/marketplace' },
    { icon: 'videos', label: 'Videos', route: '/videos' },
    { icon: 'podcasts', label: 'Podcasts', route: '/podcasts' },
    { icon: 'services', label: 'Services', route: '/services' },
    { icon: 'friends', label: 'Friends', route: '/community/friends' },
    { icon: 'groups', label: 'Groups', route: '/community/groups' },
    { icon: 'events', label: 'Events', route: '/community/events' },
    { icon: 'qa', label: 'Q&A Forum', route: '/community/qa' },
    { icon: 'saved', label: 'Saved', route: '/community/saved' }
  ];

  shortcuts: SidebarShortcut[] = [
    { id: '1', name: 'Car Enthusiasts', image: '/assets/groups/car-enthusiasts.jpg', type: 'group' },
    { id: '2', name: 'DIY Mechanics', image: '/assets/groups/diy-mechanics.jpg', type: 'group' },
    { id: '3', name: 'Electric Vehicles', image: '/assets/groups/ev-club.jpg', type: 'group' },
    { id: '4', name: 'Classic Cars', image: '/assets/groups/classic-cars.jpg', type: 'group' }
  ];

  sponsoredItems: SponsoredItem[] = [
    { id: '1', title: 'Premium Car Parts', url: 'autoparts.com', image: '/assets/ads/car-parts.jpg' },
    { id: '2', title: 'Auto Insurance Deals', url: 'carinsurance.com', image: '/assets/ads/insurance.jpg' }
  ];

  events: EventReminder[] = [
    { id: '1', title: 'Car Meet - Downtown', time: 'Tomorrow at 6:00 PM' },
    { id: '2', title: 'Auto Show 2024', time: 'This Weekend' }
  ];

  contacts: Contact[] = [
    { id: '1', name: 'John Doe', initials: 'JD', online: true },
    { id: '2', name: 'Alice Smith', initials: 'AS', online: true },
    { id: '3', name: 'Bob Johnson', initials: 'BJ', online: false },
    { id: '4', name: 'Mike Wilson', initials: 'MW', online: true },
    { id: '5', name: 'Sarah Davis', initials: 'SD', online: true }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    // Load Featured Posts
    this.communityService.getPosts({ isFeatured: true }, 1, 6).subscribe({
      next: (result: any) => {
        this.featuredPosts.set(result.items || []);
      },
      error: (error) => {
        console.error('Error loading featured posts:', error);
        this.featuredPosts.set([]);
      }
    });

    // Load Suggested Questions
    this.qaService.getQuestions({ sortBy: 'active' }, 1, 5).subscribe({
      next: (result: any) => {
        this.suggestedQuestions.set(result.items || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.suggestedQuestions.set([]);
        this.loading.set(false);
      }
    });

    // Load Categories
    this.communityService.getCategories().subscribe({
      next: (cats: any) => {
        this.categories.set(cats || []);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories.set([]);
      }
    });
  }


  getTimeAgo(date: string): string {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return postDate.toLocaleDateString();
  }
}
