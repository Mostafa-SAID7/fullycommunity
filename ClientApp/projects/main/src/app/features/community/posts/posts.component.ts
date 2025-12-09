import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarLayoutComponent } from '../../../shared/components/sidebar-layout/sidebar-layout.component';
import { type SidebarMenuItem, type SidebarShortcut } from '../../../shared/components/left-sidebar/left-sidebar.component';
import { type SponsoredItem, type EventReminder, type Contact } from '../../../shared/components/right-sidebar/right-sidebar.component';
import { PostsService } from '../../../core/services/community/posts/posts.service';
import { PostList } from '../../../core/interfaces/community/posts';
import { PagedResult } from '../../../core/interfaces/common/paged-result.interface';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayoutComponent],
  templateUrl: './posts.component.html'
})
export class PostsComponent implements OnInit {
  private postsService = inject(PostsService);
  
  posts: PostList[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  hasNextPage = false;

  leftMenuItems: SidebarMenuItem[] = [
    { icon: 'home', label: 'Home', route: '/', exact: true },
    { icon: 'feed', label: 'Feed', route: '/community', exact: true },
    { icon: 'marketplace', label: 'Marketplace', route: '/marketplace' },
    { icon: 'videos', label: 'Videos', route: '/videos' },
    { icon: 'podcasts', label: 'Podcasts', route: '/podcasts' },
    { icon: 'services', label: 'Services', route: '/services' },
    { icon: 'feed', label: 'Posts', route: '/community/posts' },
    { icon: 'friends', label: 'Friends', route: '/community/friends' },
    { icon: 'groups', label: 'Groups', route: '/community/groups' },
    { icon: 'events', label: 'Events', route: '/community/events' },
    { icon: 'qa', label: 'Q&A Forum', route: '/community/qa' },
    { icon: 'guides', label: 'Guides', route: '/community/guides' },
    { icon: 'reviews', label: 'Reviews', route: '/community/reviews' },
    { icon: 'news', label: 'News', route: '/community/news' },
    { icon: 'maps', label: 'Maps', route: '/community/maps' },
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
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.error = null;

    this.postsService.getPosts({}, this.currentPage, this.pageSize).subscribe({
      next: (result: PagedResult<PostList>) => {
        this.posts = result.items;
        this.totalPages = result.totalPages;
        this.hasNextPage = this.currentPage < result.totalPages;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load posts. Please try again.';
        this.loading = false;
        console.error('Error loading posts:', err);
      }
    });
  }

  loadMore() {
    if (this.hasNextPage && !this.loading) {
      this.currentPage++;
      this.loading = true;

      this.postsService.getPosts({}, this.currentPage, this.pageSize).subscribe({
        next: (result: PagedResult<PostList>) => {
          this.posts = [...this.posts, ...result.items];
          this.totalPages = result.totalPages;
          this.hasNextPage = this.currentPage < result.totalPages;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Failed to load more posts.';
          this.loading = false;
          this.currentPage--; // Revert page increment
          console.error('Error loading more posts:', err);
        }
      });
    }
  }

  likePost(postId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (post.isLiked) {
      this.postsService.unlikePost(postId).subscribe({
        next: () => {
          post.isLiked = false;
          post.likeCount--;
        },
        error: (err: any) => console.error('Error unliking post:', err)
      });
    } else {
      this.postsService.likePost(postId).subscribe({
        next: () => {
          post.isLiked = true;
          post.likeCount++;
        },
        error: (err: any) => console.error('Error liking post:', err)
      });
    }
  }

  commentOnPost(postId: string) {
    // Navigate to post detail or open comment modal
    console.log('Comment on post:', postId);
  }

  sharePost(postId: string) {
    // Implement share functionality
    console.log('Share post:', postId);
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  }
}
