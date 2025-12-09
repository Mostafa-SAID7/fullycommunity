import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityService, Post, PostType, CreatePostRequest } from '../../../../core/services/community/community.service';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html'
})
export class CreatePostComponent {
  private communityService = inject(CommunityService);
  private authService = inject(AuthService);

  postCreated = output<Post>();

  user = this.authService.currentUser;
  showModal = signal(false);
  isSubmitting = signal(false);

  postContent = signal('');
  postType = signal<PostType>('General');
  selectedImages = signal<string[]>([]);
  visibility = signal('Public');

  postTypes: { value: PostType; label: string; icon: string }[] = [
    { value: 'General', label: 'Post', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
    { value: 'Article', label: 'Article', icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z' },
    { value: 'Question', label: 'Question', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' },
    { value: 'Poll', label: 'Poll', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' }
  ];

  openModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm() {
    this.postContent.set('');
    this.postType.set('General');
    this.selectedImages.set([]);
    this.visibility.set('Public');
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages.update(imgs => [...imgs, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.selectedImages.update(imgs => imgs.filter((_, i) => i !== index));
  }

  submitPost() {
    if (!this.postContent().trim() || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const request: CreatePostRequest = {
      title: this.postContent().substring(0, 100),
      content: this.postContent(),
      type: this.postType(),
      visibility: this.visibility(),
      mediaUrls: this.selectedImages()
    };

    this.communityService.createPost(request).subscribe({
      next: (post) => {
        this.postCreated.emit(post);
        this.closeModal();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }
}
