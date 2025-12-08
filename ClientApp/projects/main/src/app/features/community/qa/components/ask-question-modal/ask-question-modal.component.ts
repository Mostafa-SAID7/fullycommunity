import { Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QAService, QuestionCategory } from '../../../../../core/services/community/qa.service';

@Component({
  selector: 'app-ask-question-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ask-question-modal.component.html'
})
export class AskQuestionModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private qaService = inject(QAService);

  // Outputs
  modalClosed = output<void>();
  questionCreated = output<void>();

  // State
  categories = signal<QuestionCategory[]>([]);
  submitting = signal(false);
  submitError = signal<string | null>(null);

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
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error('Failed to load categories:', err)
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
    if (this.questionForm.invalid) {
      Object.keys(this.questionForm.controls).forEach(key => {
        this.questionForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);
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
        this.questionCreated.emit();
        this.router.navigate(['/community/qa', question.id]);
      },
      error: (err) => {
        console.error('Failed to create question:', err);
        this.submitting.set(false);
        
        if (err.status === 401) {
          this.submitError.set('You must be logged in to ask a question.');
        } else if (err.status === 403) {
          this.submitError.set('You have reached your question limit. Please upgrade your account or wait.');
        } else {
          this.submitError.set('Failed to post question. Please try again.');
        }
      }
    });
  }

  closeModal() {
    this.modalClosed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
