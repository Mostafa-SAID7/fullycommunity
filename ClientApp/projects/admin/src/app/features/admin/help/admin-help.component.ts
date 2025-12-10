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
  templateUrl: './admin-help.component.html',
  styleUrl: './admin-help.component.scss'
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