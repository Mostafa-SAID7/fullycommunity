import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  lastUpdated: Date;
  views: number;
  helpful: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-admin-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Help & Documentation</h1>
          <p class="text-gray-600 mt-1">Admin guides, documentation, and support resources</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="contactSupport()" 
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            Contact Support
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input type="text" 
                   [(ngModel)]="searchQuery"
                   (input)="searchContent()"
                   placeholder="Search documentation, guides, and FAQs..."
                   class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="#getting-started" 
           class="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all group">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">Getting Started</h3>
          </div>
          <p class="text-sm text-gray-600">Learn the basics of admin panel navigation and core features</p>
        </a>

        <a href="#user-management" 
           class="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all group">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">User Management</h3>
          </div>
          <p class="text-sm text-gray-600">Manage users, roles, permissions, and access controls</p>
        </a>

        <a href="#content-moderation" 
           class="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all group">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">Content Moderation</h3>
          </div>
          <p class="text-sm text-gray-600">Review, approve, and moderate user-generated content</p>
        </a>

        <a href="#system-settings" 
           class="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all group">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">System Settings</h3>
          </div>
          <p class="text-sm text-gray-600">Configure system settings, security, and integrations</p>
        </a>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Documentation Articles -->
        <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Documentation</h2>
          </div>
          
          <div class="p-6">
            <div class="space-y-6">
              <div *ngFor="let article of filteredArticles()" 
                   class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ article.title }}</h3>
                    <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{{ article.category }}</span>
                      <span>Updated {{ article.lastUpdated | date:'short' }}</span>
                      <span>{{ article.views }} views</span>
                    </div>
                  </div>
                </div>
                
                <p class="text-gray-600 mb-4">{{ getArticleExcerpt(article.content) }}</p>
                
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let tag of article.tags" 
                          class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {{ tag }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3">
                    <button (click)="markHelpful(article)" 
                            class="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                      </svg>
                      {{ article.helpful }}
                    </button>
                    <button (click)="readArticle(article)" 
                            class="text-sm text-primary hover:text-primary-hover font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="bg-white rounded-lg border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div *ngFor="let faq of filteredFAQs()" 
                   class="border border-gray-200 rounded-lg">
                <button (click)="toggleFAQ(faq)" 
                        class="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span class="font-medium text-gray-900">{{ faq.question }}</span>
                  <svg class="w-5 h-5 text-gray-400 transition-transform" 
                       [class.rotate-180]="faq.isExpanded" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div *ngIf="faq.isExpanded" 
                     class="px-4 pb-4 text-sm text-gray-600 border-t border-gray-200 bg-gray-50">
                  <div class="pt-3">{{ faq.answer }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Support Contact -->
      <div class="bg-gradient-to-r from-primary to-primary-hover rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold mb-2">Need Additional Help?</h2>
            <p class="text-primary-light">Our support team is here to assist you with any questions or issues.</p>
          </div>
          <div class="flex items-center gap-3">
            <button (click)="openTicket()" 
                    class="px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Open Support Ticket
            </button>
            <button (click)="scheduleCall()" 
                    class="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors font-medium">
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminHelpComponent implements OnInit {
  searchQuery = '';
  articles = signal<HelpArticle[]>([]);
  filteredArticles = signal<HelpArticle[]>([]);
  faqs = signal<FAQ[]>([]);
  filteredFAQs = signal<FAQ[]>([]);

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    // Mock data
    const mockArticles: HelpArticle[] = [
      {
        id: '1',
        title: 'Getting Started with Admin Panel',
        category: 'Getting Started',
        content: 'This comprehensive guide will walk you through the basics of using the Community Car admin panel. Learn about navigation, key features, and essential workflows to get you up and running quickly.',
        tags: ['basics', 'navigation', 'setup'],
        lastUpdated: new Date(Date.now() - 86400000),
        views: 1250,
        helpful: 45
      },
      {
        id: '2',
        title: 'User Management Best Practices',
        category: 'User Management',
        content: 'Learn how to effectively manage users, assign roles, and configure permissions. This guide covers user lifecycle management, security considerations, and troubleshooting common issues.',
        tags: ['users', 'roles', 'permissions', 'security'],
        lastUpdated: new Date(Date.now() - 172800000),
        views: 890,
        helpful: 32
      },
      {
        id: '3',
        title: 'Content Moderation Guidelines',
        category: 'Content Management',
        content: 'Understand the content moderation process, review guidelines, and learn how to handle different types of content violations. Includes escalation procedures and community standards.',
        tags: ['moderation', 'content', 'guidelines', 'community'],
        lastUpdated: new Date(Date.now() - 259200000),
        views: 675,
        helpful: 28
      }
    ];

    const mockFAQs: FAQ[] = [
      {
        id: '1',
        question: 'How do I reset a user\'s password?',
        answer: 'Navigate to User Management, find the user, click on their profile, and select "Reset Password". The user will receive an email with reset instructions.',
        category: 'User Management'
      },
      {
        id: '2',
        question: 'What are the different user roles available?',
        answer: 'The system includes Super Admin, Admin, Content Admin, User Admin, and Moderator roles. Each role has specific permissions and access levels.',
        category: 'User Management'
      },
      {
        id: '3',
        question: 'How do I approve pending content?',
        answer: 'Go to the Moderation section, review the pending content, and click either "Approve" or "Reject" with appropriate reasoning.',
        category: 'Content Management'
      },
      {
        id: '4',
        question: 'How can I view system performance metrics?',
        answer: 'Access the Reports & Analytics section for detailed performance metrics, or check the System Health monitor for real-time status.',
        category: 'System Management'
      }
    ];

    this.articles.set(mockArticles);
    this.filteredArticles.set(mockArticles);
    this.faqs.set(mockFAQs);
    this.filteredFAQs.set(mockFAQs);
  }

  searchContent() {
    const query = this.searchQuery.toLowerCase();
    
    if (!query) {
      this.filteredArticles.set(this.articles());
      this.filteredFAQs.set(this.faqs());
      return;
    }

    const filteredArticles = this.articles().filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );

    const filteredFAQs = this.faqs().filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );

    this.filteredArticles.set(filteredArticles);
    this.filteredFAQs.set(filteredFAQs);
  }

  getArticleExcerpt(content: string): string {
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }

  toggleFAQ(faq: FAQ) {
    faq.isExpanded = !faq.isExpanded;
  }

  markHelpful(article: HelpArticle) {
    article.helpful++;
    console.log('Marked article as helpful:', article);
  }

  readArticle(article: HelpArticle) {
    article.views++;
    console.log('Reading article:', article);
  }

  contactSupport() {
    console.log('Contact support');
  }

  openTicket() {
    console.log('Open support ticket');
  }

  scheduleCall() {
    console.log('Schedule support call');
  }
}