import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QAService, QuestionCategory } from '../../../../core/services/community/qa.service';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-ask-question',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingStateComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto p-6">
      
      <!-- Header -->
      <div class="mb-8">
        <nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <button (click)="goBack()" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Q&A
          </button>
          <span>/</span>
          <span class="text-gray-900 dark:text-white">Ask a Question</span>
        </nav>
        
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ask a Question
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Get help from the community by asking a detailed question about your car issue.
        </p>
      </div>

      <!-- Tips Card -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Tips for a Great Question
        </h3>
        <ul class="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
          <li class="flex items-start gap-2">
            <span class="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Be specific about your car make, model, and year</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Describe the problem in detail with symptoms</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Include what you've already tried</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>Use relevant tags to help others find your question</span>
          </li>
        </ul>
      </div>

      <!-- Question Form -->
      <form [formGroup]="questionForm" (ngSubmit)="submitQuestion()" class="space-y-6">
        
        <!-- Title -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Question Title *
          </label>
          <input 
            type="text"
            formControlName="title"
            placeholder="e.g., Why is my 2018 Honda Civic making a grinding noise when braking?"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
          
          <div *ngIf="questionForm.get('title')?.invalid && questionForm.get('title')?.touched" 
               class="mt-2 text-sm text-red-600 dark:text-red-400">
            <span *ngIf="questionForm.get('title')?.errors?.['required']">Title is required</span>
            <span *ngIf="questionForm.get('title')?.errors?.['minlength']">Title must be at least 10 characters</span>
          </div>
          
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Be specific and clear. A good title helps others understand your problem quickly.
          </p>
        </div>

        <!-- Category -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Category
          </label>
          <select 
            formControlName="categoryId"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">Select a category (optional)</option>
            <option *ngFor="let category of categories()" [value]="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Content -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Question Details *
          </label>
          <textarea 
            formControlName="content"
            rows="12"
            placeholder="Describe your problem in detail. Include:&#10;• Car make, model, year, and mileage&#10;• When the problem occurs&#10;• What symptoms you're experiencing&#10;• What you've already tried&#10;• Any error codes or warning lights"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical">
          </textarea>
          
          <div *ngIf="questionForm.get('content')?.invalid && questionForm.get('content')?.touched" 
               class="mt-2 text-sm text-red-600 dark:text-red-400">
            <span *ngIf="questionForm.get('content')?.errors?.['required']">Question details are required</span>
            <span *ngIf="questionForm.get('content')?.errors?.['minlength']">Please provide more details (at least 50 characters)</span>
          </div>
        </div>

        <!-- Tags -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Tags
          </label>
          <input 
            type="text"
            formControlName="tagsInput"
            placeholder="e.g., brakes, honda, grinding-noise, maintenance"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
          
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Separate tags with commas. Use relevant keywords to help others find your question.
          </p>
          
          <!-- Popular Tags -->
          <div class="mt-4">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popular tags:</p>
            <div class="flex flex-wrap gap-2">
              <button 
                *ngFor="let tag of popularTags" 
                type="button"
                (click)="addTag(tag)"
                class="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 text-sm rounded-full transition-colors">
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-6">
          <button 
            type="button"
            (click)="goBack()"
            class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors">
            Cancel
          </button>
          
          <button 
            type="submit"
            [disabled]="questionForm.invalid || submitting()"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed">
            <span *ngIf="!submitting()">Post Question</span>
            <span *ngIf="submitting()" class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Posting...
            </span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class AskQuestionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private qaService = inject(QAService);

  categories = signal<QuestionCategory[]>([]);
  submitting = signal(false);

  questionForm: FormGroup;

  popularTags = [
    'maintenance', 'electric', 'brakes', 'engine', 'oil-change', 
    'tires', 'battery', 'transmission', 'suspension', 'diagnostics',
    'hybrid', 'tesla', 'bmw', 'mercedes', 'toyota', 'honda'
  ];

  constructor() {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      categoryId: [''],
      tagsInput: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.qaService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories)
    });
  }

  addTag(tag: string) {
    const currentTags = this.questionForm.get('tagsInput')?.value || '';
    const tagsArray = currentTags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
    
    if (!tagsArray.includes(tag)) {
      tagsArray.push(tag);
      this.questionForm.patchValue({
        tagsInput: tagsArray.join(', ')
      });
    }
  }

  submitQuestion() {
    if (this.questionForm.invalid) return;

    this.submitting.set(true);
    const formValue = this.questionForm.value;

    this.qaService.createQuestion({
      title: formValue.title,
      content: formValue.content,
      tags: formValue.tagsInput ? 
        formValue.tagsInput.split(',').map((t: string) => t.trim()).filter((t: string) => t) : 
        [],
      categoryId: formValue.categoryId || undefined
    }).subscribe({
      next: (question) => {
        this.submitting.set(false);
        // Navigate to the new question
        this.router.navigate(['/community/qa', question.id]);
      },
      error: (err) => {
        console.error('Failed to create question:', err);
        this.submitting.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/community/qa']);
  }
}