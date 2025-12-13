import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Answer, AnswerComment } from '../../../../../core/interfaces/community/qa';
import { CommentService } from '../../../../../core/services/community/qa/comment.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-answer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './answer-list.component.html'
})
export class AnswerListComponent {
  private router = inject(Router);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);

  // Inputs
  answers = input.required<Answer[]>();

  // Outputs
  voteAnswer = output<{ answerId: string; voteType: 1 | -1 }>();
  scrollToForm = output<void>();
  answersUpdated = output<Answer[]>();

  // Answer collapse state
  answersExpanded = signal(false);

  // Comment management
  showCommentForm = signal<string | null>(null);
  newComment = signal<{ [answerId: string]: string }>({});
  commentSubmitting = signal<string | null>(null);
  editingComment = signal<string | null>(null);
  editCommentContent = signal<string>('');
  submitError = signal<string | null>(null);

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleAnswers() {
    this.answersExpanded.set(!this.answersExpanded());
  }

  getAuthorDisplayName(fullName: string): string {
    // Extract first part before @ or .
    if (fullName.includes('@')) {
      return fullName.split('@')[0].split('.')[0];
    }
    return fullName.split('.')[0];
  }

  toggleCommentForm(answerId: string) {
    const current = this.showCommentForm();
    this.showCommentForm.set(current === answerId ? null : answerId);

    if (!this.newComment()[answerId]) {
      this.newComment.set({ ...this.newComment(), [answerId]: '' });
    }
  }

  updateCommentContent(answerId: string, content: string) {
    this.newComment.set({ ...this.newComment(), [answerId]: content });
  }

  submitComment(answerId: string) {
    const content = this.newComment()[answerId]?.trim();
    if (!content) return;

    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    this.commentSubmitting.set(answerId);

    this.commentService.addComment(answerId, { content }).subscribe({
      next: (comment: AnswerComment) => {
        const currentAnswers = this.answers();
        const updatedAnswers = currentAnswers.map(a => {
          if (a.id === answerId) {
            return {
              ...a,
              comments: [...(a.comments || []), comment]
            };
          }
          return a;
        });
        this.answersUpdated.emit(updatedAnswers);

        this.newComment.set({ ...this.newComment(), [answerId]: '' });
        this.showCommentForm.set(null);
        this.commentSubmitting.set(null);
      },
      error: (err: any) => {
        console.error('Failed to add comment:', err);
        this.commentSubmitting.set(null);

        if (err.status === 401) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        } else {
          this.submitError.set('Failed to add comment. Please try again.');
        }
      }
    });
  }

  startEditComment(comment: AnswerComment) {
    this.editingComment.set(comment.id);
    this.editCommentContent.set(comment.content);
  }

  cancelEditComment() {
    this.editingComment.set(null);
    this.editCommentContent.set('');
  }

  saveEditComment(answerId: string, commentId: string) {
    const content = this.editCommentContent().trim();
    if (!content) return;

    this.commentService.updateComment(commentId, { content }).subscribe({
      next: (updatedComment: AnswerComment) => {
        const currentAnswers = this.answers();
        const updatedAnswers = currentAnswers.map(a => {
          if (a.id === answerId) {
            return {
              ...a,
              comments: a.comments?.map((c: AnswerComment) => c.id === commentId ? updatedComment : c) || []
            };
          }
          return a;
        });
        this.answersUpdated.emit(updatedAnswers);

        this.editingComment.set(null);
        this.editCommentContent.set('');
      },
      error: (err: any) => {
        console.error('Failed to update comment:', err);
        this.submitError.set('Failed to update comment. Please try again.');
      }
    });
  }

  deleteComment(answerId: string, commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        const currentAnswers = this.answers();
        const updatedAnswers = currentAnswers.map(a => {
          if (a.id === answerId) {
            return {
              ...a,
              comments: a.comments?.filter((c: AnswerComment) => c.id !== commentId) || []
            };
          }
          return a;
        });
        this.answersUpdated.emit(updatedAnswers);
      },
      error: (err: any) => {
        console.error('Failed to delete comment:', err);
        this.submitError.set('Failed to delete comment. Please try again.');
      }
    });
  }

  isCommentAuthor(comment: AnswerComment): boolean {
    const currentUser = this.authService.currentUser();
    return currentUser?.id === comment.authorId;
  }
}
