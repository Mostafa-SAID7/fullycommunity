import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminModerationService, ModerationItem, ModerationStats } from '../../../core/services/admin-moderation.service';

@Component({
  selector: 'moderation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderation.component.html',
  styleUrl: './moderation.component.scss'
})
export class ModerationComponent implements OnInit {
  stats = signal<ModerationStats | null>(null);
  items = signal<ModerationItem[]>([]);
  loading = signal(false);
  activeTab: 'pending' | 'resolved' | 'all' = 'pending';
  selectedItem = signal<ModerationItem | null>(null);
  showActionModal = signal(false);
  actionType = signal<'approve' | 'reject' | 'dismiss' | 'ban' | null>(null);
  actionNotes = '';

  constructor(private moderationService: AdminModerationService) {}

  ngOnInit() {
    this.loadStats();
    this.loadItems();
  }

  loadStats() {
    this.moderationService.getModerationStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  loadItems() {
    this.loading.set(true);
    
    const request = this.activeTab === 'pending' 
      ? this.moderationService.getPendingItems()
      : this.moderationService.getAllItems(1, 20, this.activeTab === 'resolved' ? 'resolved' : undefined);

    request.subscribe({
      next: (response) => {
        this.items.set(response.items || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.loading.set(false);
      }
    });
  }

  setTab(tab: 'pending' | 'resolved' | 'all') {
    this.activeTab = tab;
    this.loadItems();
  }

  isHighPriority(item: ModerationItem): boolean {
    return item.priority === 'high' || item.priority === 'urgent' ||
           item.reportReason.toLowerCase().includes('harassment') || 
           item.reportReason.toLowerCase().includes('hatespeech');
  }

  getPriorityClass(item: ModerationItem): string {
    return `priority-${item.priority || 'normal'}`;
  }

  getReasonClass(reason: string): string {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('spam')) return 'type-spam';
    if (lowerReason.includes('inappropriate')) return 'type-inappropriate';
    if (lowerReason.includes('harassment')) return 'type-harassment';
    if (lowerReason.includes('hatespeech')) return 'type-hatespeech';
    if (lowerReason.includes('violence')) return 'type-violence';
    return 'type-other';
  }

  openActionModal(item: ModerationItem, action: 'approve' | 'reject' | 'dismiss' | 'ban') {
    this.selectedItem.set(item);
    this.actionType.set(action);
    this.actionNotes = '';
    this.showActionModal.set(true);
  }

  closeModal() {
    this.showActionModal.set(false);
    this.selectedItem.set(null);
    this.actionType.set(null);
    this.actionNotes = '';
  }

  confirmAction() {
    const item = this.selectedItem();
    const action = this.actionType();
    if (!item || !action) return;

    let request;
    switch (action) {
      case 'approve':
        request = this.moderationService.approveItem(item.id, this.actionNotes);
        break;
      case 'reject':
        request = this.moderationService.rejectItem(item.id, this.actionNotes || 'Content removed');
        break;
      case 'dismiss':
        request = this.moderationService.dismissItem(item.id, this.actionNotes);
        break;
      case 'ban':
        const duration = parseInt(prompt('Ban duration in days (0 for permanent):') || '0');
        request = this.moderationService.banUser(item.contentId, this.actionNotes || 'Violation of terms', duration || undefined);
        break;
      default:
        return;
    }

    request.subscribe({
      next: () => {
        this.closeModal();
        this.loadItems();
        this.loadStats();
      },
      error: (err) => console.error(`Error performing ${action}:`, err)
    });
  }

  quickApprove(item: ModerationItem) {
    this.moderationService.approveItem(item.id).subscribe({
      next: () => {
        this.loadItems();
        this.loadStats();
      },
      error: (err) => console.error('Error approving item:', err)
    });
  }

  quickReject(item: ModerationItem) {
    this.moderationService.rejectItem(item.id, 'Content violates community guidelines').subscribe({
      next: () => {
        this.loadItems();
        this.loadStats();
      },
      error: (err) => console.error('Error rejecting item:', err)
    });
  }
}
