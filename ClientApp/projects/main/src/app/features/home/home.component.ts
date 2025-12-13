import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { StoriesComponent } from './components/stories/stories.component';
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { FeaturedPostsComponent } from './components/featured-posts/featured-posts.component';
import { TrendingQuestionsComponent } from './components/trending-questions/trending-questions.component';
import { PopularCategoriesComponent } from './components/popular-categories/popular-categories.component';
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
  imports: [
    CommonModule,
    StoriesComponent,
    QuickActionsComponent,
    FeaturedPostsComponent,
    TrendingQuestionsComponent,
    PopularCategoriesComponent,
    SidebarLayoutComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);

  user = this.authService.currentUser;

  stats = signal<CommunityStats>({
    members: 12500,
    posts: 45000,
    experts: 350,
    garages: 1200
  });

  // Computed properties
  isAuthenticated = computed(() => !!this.user());

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

  ngOnInit(): void {
    // Component initialization - individual components handle their own data loading
  }
}
