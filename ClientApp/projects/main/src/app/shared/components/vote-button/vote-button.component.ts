import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote-button.component.html'
})
export class VoteButtonComponent {
  voteCount = input.required<number>();
  currentVote = input<number>(0); // 0 = no vote, 1 = upvote, -1 = downvote
  disabled = input<boolean>(false);
  containerClass = input<string>('min-w-[60px]');

  upvote = output<void>();
  downvote = output<void>();

  onUpvote() {
    if (!this.disabled()) {
      this.upvote.emit();
    }
  }

  onDownvote() {
    if (!this.disabled()) {
      this.downvote.emit();
    }
  }
}
