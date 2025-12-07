import { Component, inject, signal, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QAService, QuestionCategory, CreateQuestionRequest } from '../../../core/services/community/qa.service';

@Component({
  selector: 'app-ask-question-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ask-question-modal.component.html'
})
export class AskQuestionModalComponent implements OnInit {
  private qaService = inject(QAService);

  // Outputs
  questionCreated = output<void>();
  modalClosed = output<void>();

  // Form data
  title = '';
  content = '';
  tagsInput = '';
  selectedCategoryId = '';
  
  // State
  categories = signal<QuestionCategory[]>([]);
  creating = signal(false);
  loadingCategories = signal(false);
  
  // Validation
  titleError = signal<string | null>(null);
  contentError = signal<string | null>(null);
  tagsError = signal<string | null>(null);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loadingCategories.set(true);
    this.qaService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loadingCategories.set(false);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.loadingCategories.set(false);
      }
    });
  }

  validateTitle(): boolean {
    if (!this.title.trim()) {
      this.titleError.set('Title is required');
      return false;
    }
    if (this.title.trim().length < 10) {
      this.titleError.set('Title must be at least 10 characters');
      return false;
    }
    if (this.title.trim().length > 200) {
      this.titleError.set('Title must be less than 200 characters');
      return false;
    }
    this.titleError.set(null);
    return true;
  }

  validateContent(): boolean {
    if (!this.content.trim()) {
      this.contentError.set('Question details are required');
      return false;
    }
    if (this.content.trim().length < 20) {
      this.contentError.set('Please provide more details (at least 20 characters)');
      return false;
    }
    this.contentError.set(null);
    return true;
  }

  validateTags(): boolean {
    const tags = this.getTags();
    if (tags.length === 0) {
      this.tagsError.set('At least one tag is required');
      return false;
    }
    if (tags.length > 5) {
      this.tagsError.set('Maximum 5 tags allowed');
      return false;
    }
    this.tagsError.set(null);
    return true;
  }

  getTags(): string[] {
    return this.tagsInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);
  }

  canCreate(): boolean {
    return this.title.trim().length >= 10 && 
           this.content.trim().length >= 20 && 
           this.getTags().length > 0 &&
           this.getTags().length <= 5;
  }

  async createQuestion() {
    if (!this.canCreate() || this.creating()) return;

    // Validate all fields
    const titleValid = this.validateTitle();
    const contentValid = this.validateContent();
    const tagsValid = this.validateTags();

    if (!titleValid || !contentValid || !tagsValid) {
      return;
    }

    this.creating.set(true);

    try {
      const request: CreateQuestionRequest = {
        title: this.title.trim(),
        content: this.content.trim(),
        tags: this.getTags(),
        categoryId: this.selectedCategoryId || undefined
      };

      this.qaService.createQuestion(request).subscribe({
        next: () => {
          this.questionCreated.emit();
          this.close();
        },
        error: (error) => {
          console.error('Error creating question:', error);
          alert('Failed to create question. Please try again.');
          this.creating.set(false);
        }
      });
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Failed to create question. Please try again.');
      this.creating.set(false);
    }
  }

  close() {
    this.modalClosed.emit();
  }

  // Helper to add common tags
  addTag(tag: string) {
    const currentTags = this.getTags();
    if (!currentTags.includes(tag.toLowerCase()) && currentTags.length < 5) {
      this.tagsInput = currentTags.length > 0 
        ? `${this.tagsInput}, ${tag}` 
        : tag;
    }
  }
}
