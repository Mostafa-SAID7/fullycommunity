import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
      <span class="text-sm text-gray-700">
        {{ displayText() }}
      </span>
      <div class="flex gap-2">
        <button 
          (click)="previous.emit()" 
          [disabled]="currentPage() === 1" 
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Previous
        </button>
        <button 
          (click)="next.emit()" 
          [disabled]="currentPage() >= totalPages()" 
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Next
        </button>
      </div>
    </div>
  `
})
export class PaginationComponent {
  currentPage = input.required<number>();
  pageSize = input.required<number>();
  totalCount = input.required<number>();
  itemName = input<string>('items');
  
  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));
  
  displayText = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), this.totalCount());
    return `Showing ${start} to ${end} of ${this.totalCount()} ${this.itemName()}`;
  });
  
  previous = output<void>();
  next = output<void>();
}
