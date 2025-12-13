import { Component, inject, signal, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LogoButtonComponent } from '../../../components/logo-button/logo-button.component';
import { CopyrightComponent } from '../../components/copyright/copyright.component';

export interface SupportTicket {
  subject: string;
  category: string;
  priority: string;
  description: string;
  attachments?: File[];
  userEmail?: string;
  userName?: string;
}

@Component({
  selector: 'app-support-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoButtonComponent, CopyrightComponent],
  templateUrl: './support-form.component.html',
  styleUrl: './support-form.component.scss'
})
export class SupportFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() title = 'Contact Support';
  @Input() userEmail = '';
  @Input() userName = '';
  @Output() ticketSubmitted = new EventEmitter<SupportTicket>();
  @Output() cancelled = new EventEmitter<void>();

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  attachments = signal<File[]>([]);

  categories = [
    { value: 'technical', label: 'Technical Issue' },
    { value: 'account', label: 'Account Problem' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'other', label: 'Other' }
  ];

  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  supportForm: FormGroup = this.fb.group({
    subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    category: ['', Validators.required],
    priority: ['medium', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
    userEmail: [this.userEmail, [Validators.required, Validators.email]],
    userName: [this.userName]
  });

  ngOnInit() {
    if (this.userEmail) {
      this.supportForm.patchValue({ userEmail: this.userEmail });
    }
    if (this.userName) {
      this.supportForm.patchValue({ userName: this.userName });
    }
  }

  get subjectControl() { return this.supportForm.get('subject'); }
  get categoryControl() { return this.supportForm.get('category'); }
  get priorityControl() { return this.supportForm.get('priority'); }
  get descriptionControl() { return this.supportForm.get('description'); }
  get userEmailControl() { return this.supportForm.get('userEmail'); }
  get userNameControl() { return this.supportForm.get('userName'); }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const maxFiles = 5;
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    
    const currentAttachments = this.attachments();
    
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSizeBytes) {
        this.errorMessage.set(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    const newAttachments = [...currentAttachments, ...validFiles];
    
    if (newAttachments.length > maxFiles) {
      this.errorMessage.set(`Maximum ${maxFiles} files allowed.`);
      return;
    }
    
    this.attachments.set(newAttachments);
    this.errorMessage.set('');
  }

  removeAttachment(index: number) {
    const currentAttachments = this.attachments();
    const newAttachments = currentAttachments.filter((_, i) => i !== index);
    this.attachments.set(newAttachments);
  }

  onSubmit() {
    if (this.supportForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.supportForm.value;
    const ticket: SupportTicket = {
      subject: formValue.subject,
      category: formValue.category,
      priority: formValue.priority,
      description: formValue.description,
      userEmail: formValue.userEmail,
      userName: formValue.userName,
      attachments: this.attachments()
    };

    this.loading.set(true);
    this.errorMessage.set('');

    // Simulate API call
    setTimeout(() => {
      this.loading.set(false);
      this.successMessage.set('Support ticket submitted successfully!');
      this.ticketSubmitted.emit(ticket);
      
      setTimeout(() => {
        this.successMessage.set('');
      }, 5000);
    }, 1500);
  }
  onCancel() {
    this.supportForm.reset();
    this.attachments.set([]);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.cancelled.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.supportForm.controls).forEach(key => {
      const control = this.supportForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.supportForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['maxlength']) return `${this.getFieldDisplayName(fieldName)} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      subject: 'Subject',
      category: 'Category',
      priority: 'Priority',
      description: 'Description',
      userEmail: 'Email',
      userName: 'Name'
    };
    return displayNames[fieldName] || fieldName;
  }

  getCharacterCount(fieldName: string): string {
    const control = this.supportForm.get(fieldName);
    const value = control?.value || '';
    const maxLength = control?.hasError('maxlength') ? control.errors?.['maxlength']?.requiredLength : 2000;
    return `${value.length}/${maxLength}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}