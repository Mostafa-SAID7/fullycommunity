import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'moderation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="moderation">
      <h1>Content Moderation</h1>
      <div class="moderation-queue">
        <div class="queue-item">
          <h3>Reported Review</h3>
          <p>Inappropriate language in BMW service review</p>
          <div class="actions">
            <button class="btn approve">Approve</button>
            <button class="btn reject">Reject</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .moderation { max-width: 1200px; }
    .queue-item { background: white; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
    .actions { margin-top: 1rem; }
    .btn { padding: 0.5rem 1rem; margin-right: 0.5rem; border: none; border-radius: 4px; cursor: pointer; }
    .approve { background: #28a745; color: white; }
    .reject { background: #dc3545; color: white; }
  `]
})
export class ModerationComponent {}