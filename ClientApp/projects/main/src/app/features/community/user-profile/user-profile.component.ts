import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QAService } from '../../../core/services/community/qa/qa.service';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

interface UserProfile {
  userId: string;
  userName: string;
  avatarUrl?: string;
  questionsCount: number;
  answersCount: number;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private qaService = inject(QAService);

  userId = signal<string>('');
  profile = signal<UserProfile | null>(null);
  questions = signal<any[]>([]);
  answers = signal<any[]>([]);
  activeTab = signal<'questions' | 'answers'>('questions');
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId.set(id);
      this.loadUserProfile(id);
    }
  }

  loadUserProfile(userId: string) {
    this.loading.set(true);
    this.error.set(null);

    // Load user's questions
    this.qaService.getUserQuestions(userId, 1, 100).subscribe({
      next: (result) => {
        this.questions.set(result.items);
        
        // Create profile from first question's author data
        if (result.items.length > 0) {
          const firstQuestion = result.items[0];
          this.profile.set({
            userId: firstQuestion.authorId,
            userName: firstQuestion.authorName,
            avatarUrl: firstQuestion.authorAvatarUrl,
            questionsCount: result.totalCount,
            answersCount: 0 // Will be updated when we load answers
          });
        }
        
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load user profile:', err);
        this.error.set('Failed to load user profile');
        this.loading.set(false);
      }
    });
  }

  switchTab(tab: 'questions' | 'answers') {
    this.activeTab.set(tab);
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
