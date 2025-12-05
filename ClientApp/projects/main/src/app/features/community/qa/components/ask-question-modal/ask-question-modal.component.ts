import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface QuestionCategory {
  id: string;
  name: string;
}

export interface NewQuestionForm {
  title: string;
  content: string;
  tagsInput: string;
  categoryId: string;
}

@Component({
  selector: 'app-ask-question-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Enhanced Ask Question Modal -->
    <div *ngIf="show()" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div class="fluent-card max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div class="p-8">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Ask a Question</h2>
              <p class="text-gray-600 dark:text-gray-400 mt-2">Get help from the automotive community</p>
            </div>
            <button (click)="close()" 
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- Form -->
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Question Title *
              </label>
              <input type="text" 
                     [ngModel]="formData().title" (ngModelChange)="updateFormData('title', $event)" 
                     placeholder="What's your automotive question? Be specific and clear."
                     class="fluent-input text-lg"
                     maxlength="200">
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {{ (formData().title || '').length }}/200 characters
              </p>
            </div>
            
            <!-- Category -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Category
              </label>
              <select [ngModel]="formData().categoryId" (ngModelChange)="updateFormData('categoryId', $event)" class="fluent-input">
                <option value="">Select a category (optional)</option>
                <option *ngFor="let category of categories()" [value]="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <!-- Content -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Question Details *
              </label>
              <textarea [ngModel]="formData().content" (ngModelChange)="updateFormData('content', $event)" 
                        rows="8"
                        placeholder="Provide detailed information about your question:&#10;&#10;• What specific problem are you experiencing?&#10;• What have you already tried?&#10;• What car make/model/year?&#10;• Any error messages or symptoms?"
                        class="fluent-input resize-none"
                        maxlength="2000"></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {{ (formData().content || '').length }}/2000 characters
              </p>
            </div>
            
            <!-- Tags -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Tags
              </label>
              <input type="text" 
                     [ngModel]="formData().tagsInput" (ngModelChange)="updateFormData('tagsInput', $event)" 
                     placeholder="e.g., maintenance, oil-change, toyota, engine-trouble"
                     class="fluent-input">
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Separate tags with commas. Use relevant tags to help others find your question.
              </p>
              
              <!-- Popular Tags Suggestions -->
              <div class="mt-3">
                <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Popular tags:</p>
                <div class="flex flex-wrap gap-2">
                  <button *ngFor="let tag of popularTags(); trackBy: trackByTag"
                          (click)="addTagToInput(tag)"
                          class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Form Actions -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              By posting, you agree to our community guidelines
            </div>
            <div class="flex gap-3">
              <button (click)="close()" 
                      class="fluent-button secondary px-6 py-3">
                Cancel
              </button>
              <button (click)="submit()" 
                      [disabled]="!formData().title || !formData().content"
                      class="fluent-button primary px-8 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                Post Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AskQuestionModalComponent {
  show = input.required<boolean>();
  categories = input.required<QuestionCategory[]>();
  popularTags = input.required<string[]>();
  
  formData = model.required<NewQuestionForm>();
  
  closed = output<void>();
  submitted = output<NewQuestionForm>();

  close() {
    this.closed.emit();
  }

  submit() {
    if (!this.formData().title || !this.formData().content) return;
    this.submitted.emit(this.formData());
  }

  addTagToInput(tag: string) {
    const currentTags = this.formData().tagsInput.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      this.formData.update(form => ({
        ...form,
        tagsInput: newTags.join(', ')
      }));
    }
  }

  updateFormData(field: keyof NewQuestionForm, value: string) {
    this.formData.update(form => ({
      ...form,
      [field]: value
    }));
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }
}