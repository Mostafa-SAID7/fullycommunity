import { Component, OnInit, signal, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminReportsService } from '../../../core/services/admin/reports.service';
import { RefreshButtonComponent } from '../../../shared/ui/buttons/refresh-button/refresh-button.component';
import {
  LocalizationData,
  SupportedLanguage,
  Translation,
  ContentTranslation,
  TranslationStats
} from '../../../core/interfaces/admin/reports.interface';

@Component({
  selector: 'app-localization-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RefreshButtonComponent
  ],
  templateUrl: './localization-management.component.html',
  styleUrls: ['./localization-management.component.scss']
})
export class LocalizationManagementComponent implements OnInit, OnDestroy {
  private reportsService = inject(AdminReportsService);
  private fb = inject(FormBuilder);

  // Signals
  languages = signal<SupportedLanguage[]>([]);
  translations = signal<Translation[]>([]);
  contentTranslations = signal<ContentTranslation[]>([]);
  stats = signal<TranslationStats | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Refresh button state
  refreshStatus: 'success' | 'error' | 'warning' | null = null;
  lastRefreshTime: Date | null = null;

  // UI State
  activeTab = signal<'languages' | 'translations' | 'content' | 'stats'>('languages');
  selectedLanguage = signal<string>('');
  selectedCategory = signal<string>('');
  searchTerm = signal<string>('');
  showAddLanguageModal = signal(false);
  showEditTranslationModal = signal(false);
  selectedTranslation = signal<Translation | null>(null);

  // Forms
  addLanguageForm: FormGroup;
  editTranslationForm: FormGroup;

  // Filters
  translationFilters = {
    status: '',
    category: '',
    search: ''
  };

  contentFilters = {
    type: '',
    language: '',
    status: ''
  };

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor() {
    this.addLanguageForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[a-z]{2}(-[A-Z]{2})?$/)]],
      name: ['', Validators.required],
      nativeName: ['', Validators.required],
      isActive: [true],
      flag: ['']
    });

    this.editTranslationForm = this.fb.group({
      key: ['', Validators.required],
      category: ['', Validators.required],
      defaultValue: ['', Validators.required],
      context: [''],
      isPlural: [false]
    });

    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.loadTranslations();
    });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      languages: this.reportsService.getSupportedLanguages().pipe(catchError(() => of([]))),
      stats: this.reportsService.getTranslationStats().pipe(catchError(() => of(null)))
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ languages, stats }) => {
        this.languages.set(languages);
        this.stats.set(stats);
        if (languages.length > 0 && !this.selectedLanguage()) {
          this.selectedLanguage.set(languages[0].code);
        }
        this.loadTranslations();
        this.loadContentTranslations();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading localization data:', err);
        this.error.set('Failed to load localization data.');
        this.loading.set(false);
      }
    });
  }

  loadTranslations() {
    const languageCode = this.selectedLanguage();
    const category = this.selectedCategory();
    
    this.reportsService.getTranslations(languageCode, category).pipe(
      takeUntil(this.destroy$),
      catchError(() => of([]))
    ).subscribe(translations => {
      let filtered = translations;
      
      // Apply filters
      if (this.translationFilters.status) {
        filtered = filtered.filter(t => t.status === this.translationFilters.status);
      }
      
      if (this.translationFilters.search) {
        const search = this.translationFilters.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.key.toLowerCase().includes(search) ||
          t.defaultValue.toLowerCase().includes(search)
        );
      }
      
      this.translations.set(filtered);
    });
  }

  loadContentTranslations() {
    const languageCode = this.selectedLanguage();
    const contentType = this.contentFilters.type;
    
    this.reportsService.getContentTranslations(contentType, languageCode).pipe(
      takeUntil(this.destroy$),
      catchError(() => of([]))
    ).subscribe(contentTranslations => {
      this.contentTranslations.set(contentTranslations);
    });
  }

  // Language Management
  addLanguage() {
    if (this.addLanguageForm.valid) {
      const languageData = this.addLanguageForm.value;
      this.reportsService.addLanguage(languageData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (newLanguage) => {
          const currentLanguages = this.languages();
          this.languages.set([...currentLanguages, newLanguage]);
          this.showAddLanguageModal.set(false);
          this.addLanguageForm.reset();
        },
        error: (err) => {
          console.error('Error adding language:', err);
          this.error.set('Failed to add language.');
        }
      });
    }
  }

  toggleLanguageStatus(language: SupportedLanguage) {
    this.reportsService.updateLanguage(language.code, { isActive: !language.isActive }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedLanguage) => {
        const languages = this.languages();
        const index = languages.findIndex(l => l.code === language.code);
        if (index !== -1) {
          languages[index] = updatedLanguage;
          this.languages.set([...languages]);
        }
      },
      error: (err) => {
        console.error('Error updating language:', err);
        this.error.set('Failed to update language status.');
      }
    });
  }

  deleteLanguage(language: SupportedLanguage) {
    if (confirm(`Are you sure you want to delete the language "${language.name}"? This action cannot be undone.`)) {
      this.reportsService.deleteLanguage(language.code).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          const languages = this.languages().filter(l => l.code !== language.code);
          this.languages.set(languages);
        },
        error: (err) => {
          console.error('Error deleting language:', err);
          this.error.set('Failed to delete language.');
        }
      });
    }
  }

  // Translation Management
  editTranslation(translation: Translation) {
    this.selectedTranslation.set(translation);
    this.editTranslationForm.patchValue({
      key: translation.key,
      category: translation.category,
      defaultValue: translation.defaultValue,
      context: translation.context || '',
      isPlural: translation.isPlural
    });
    this.showEditTranslationModal.set(true);
  }

  updateTranslation(translationId: string, languageCode: string, value: string) {
    this.reportsService.updateTranslation(translationId, languageCode, value).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedTranslation) => {
        const translations = this.translations();
        const index = translations.findIndex(t => t.id === translationId);
        if (index !== -1) {
          translations[index] = updatedTranslation;
          this.translations.set([...translations]);
        }
      },
      error: (err) => {
        console.error('Error updating translation:', err);
        this.error.set('Failed to update translation.');
      }
    });
  }

  // Content Translation Management
  updateContentTranslation(contentId: string, languageCode: string, title: string, content: string) {
    this.reportsService.updateContentTranslation(contentId, languageCode, { title, content }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedContent) => {
        const contentTranslations = this.contentTranslations();
        const index = contentTranslations.findIndex(c => c.id === contentId);
        if (index !== -1) {
          contentTranslations[index] = updatedContent;
          this.contentTranslations.set([...contentTranslations]);
        }
      },
      error: (err) => {
        console.error('Error updating content translation:', err);
        this.error.set('Failed to update content translation.');
      }
    });
  }

  // Import/Export
  exportTranslations(languageCode: string) {
    this.reportsService.exportTranslations(languageCode, 'json').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translations-${languageCode}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error exporting translations:', err);
        this.error.set('Failed to export translations.');
      }
    });
  }

  onFileSelected(event: Event, languageCode: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.reportsService.importTranslations(languageCode, file).subscribe({
        next: (result) => {
          console.log(`Imported ${result.imported} translations`);
          if (result.errors.length > 0) {
            console.warn('Import errors:', result.errors);
          }
          this.loadTranslations();
        },
        error: (err) => {
          console.error('Error importing translations:', err);
          this.error.set('Failed to import translations.');
        }
      });
    }
  }

  // Tab Management
  setActiveTab(tab: 'languages' | 'translations' | 'content' | 'stats') {
    this.activeTab.set(tab);
  }

  // Search and Filters
  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onSearchChange(target.value);
  }

  applyTranslationFilters() {
    this.loadTranslations();
  }

  applyContentFilters() {
    this.loadContentTranslations();
  }

  clearFilters() {
    this.translationFilters = { status: '', category: '', search: '' };
    this.contentFilters = { type: '', language: '', status: '' };
    this.loadTranslations();
    this.loadContentTranslations();
  }

  // Utility Methods
  getLanguageProgress(languageCode: string): number {
    const stats = this.stats();
    return stats?.languageProgress[languageCode] || 0;
  }

  getTranslationStatusColor(status: string): string {
    switch (status) {
      case 'complete': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'missing': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getContentStatusColor(status: string): string {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  trackByLanguageCode(index: number, language: SupportedLanguage): string {
    return language.code;
  }

  trackByTranslationId(index: number, translation: Translation): string {
    return translation.id;
  }

  trackByContentId(index: number, content: ContentTranslation): string {
    return content.id;
  }

  // Refresh functionality
  refreshData() {
    this.refreshStatus = null;
    this.loadData();
    
    // Set success status after loading completes
    setTimeout(() => {
      if (!this.loading()) {
        this.refreshStatus = 'success';
        this.lastRefreshTime = new Date();
        
        // Clear success status after 3 seconds
        setTimeout(() => {
          this.refreshStatus = null;
        }, 3000);
      }
    }, 1000);
  }
}