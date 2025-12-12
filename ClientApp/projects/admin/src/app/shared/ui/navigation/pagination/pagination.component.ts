import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
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