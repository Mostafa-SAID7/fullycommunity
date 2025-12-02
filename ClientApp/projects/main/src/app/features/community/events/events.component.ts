import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Event {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
  isAttending: boolean;
  isInterested: boolean;
  organizer: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="events-page">
      <div class="page-header">
        <h1>Events</h1>
        <button class="create-btn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          Create Event
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab() === 'upcoming'" (click)="activeTab.set('upcoming')">Upcoming</button>
        <button class="tab" [class.active]="activeTab() === 'going'" (click)="activeTab.set('going')">Going</button>
        <button class="tab" [class.active]="activeTab() === 'past'" (click)="activeTab.set('past')">Past</button>
      </div>

      <!-- Events List -->
      <div class="events-list">
        @for (event of events(); track event.id) {
          <div class="event-card">
            <div class="event-cover" [style.background-image]="event.coverImage ? 'url(' + event.coverImage + ')' : ''">
              <div class="event-date-badge">
                <span class="month">{{ getMonth(event.date) }}</span>
                <span class="day">{{ getDay(event.date) }}</span>
              </div>
            </div>
            <div class="event-info">
              <span class="event-datetime">{{ event.date }} at {{ event.time }}</span>
              <h3>{{ event.title }}</h3>
              <p class="event-location">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {{ event.location }}
              </p>
              <p class="event-attendees">{{ event.attendeeCount }} going · Hosted by {{ event.organizer }}</p>
              <div class="event-actions">
                <button class="action-btn" [class.active]="event.isAttending" (click)="toggleAttending(event)">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  {{ event.isAttending ? 'Going' : 'Going' }}
                </button>
                <button class="action-btn secondary" [class.active]="event.isInterested" (click)="toggleInterested(event)">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  Interested
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .events-page { padding: 1rem 0; }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      
      h1 { margin: 0; font-size: 1.5rem; }
    }
    
    .create-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: #1877f2;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      
      svg { width: 20px; height: 20px; }
      &:hover { background: #166fe5; }
    }
    
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .tab {
      padding: 0.625rem 1rem;
      border: none;
      background: #e4e6eb;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      
      &.active { background: #e7f3ff; color: #1877f2; }
      &:hover:not(.active) { background: #d8dadf; }
    }
    
    .events-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .event-card {
      display: flex;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .event-cover {
      width: 200px;
      min-height: 180px;
      background: linear-gradient(135deg, #f093fb, #f5576c);
      background-size: cover;
      background-position: center;
      position: relative;
      flex-shrink: 0;
    }
    
    .event-date-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #fff;
      border-radius: 8px;
      padding: 0.5rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      .month {
        display: block;
        font-size: 0.7rem;
        font-weight: 600;
        color: #e41e3f;
        text-transform: uppercase;
      }
      
      .day {
        display: block;
        font-size: 1.25rem;
        font-weight: 700;
        color: #050505;
      }
    }
    
    .event-info {
      flex: 1;
      padding: 1rem;
      
      .event-datetime {
        font-size: 0.85rem;
        color: #e41e3f;
        font-weight: 600;
      }
      
      h3 {
        margin: 0.25rem 0 0.5rem;
        font-size: 1.1rem;
      }
      
      .event-location {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin: 0 0 0.25rem;
        font-size: 0.9rem;
        color: #65676b;
        
        svg { width: 16px; height: 16px; }
      }
      
      .event-attendees {
        margin: 0 0 0.75rem;
        font-size: 0.85rem;
        color: #65676b;
      }
    }
    
    .event-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      border: none;
      background: #1877f2;
      color: #fff;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      
      svg { width: 18px; height: 18px; }
      
      &:hover { background: #166fe5; }
      &.active { background: #42b72a; }
      
      &.secondary {
        background: #e4e6eb;
        color: #050505;
        
        &:hover { background: #d8dadf; }
        &.active { background: #ffc107; color: #050505; }
      }
    }
    
    @media (max-width: 600px) {
      .event-card { flex-direction: column; }
      .event-cover { width: 100%; min-height: 150px; }
    }
  `]
})
export class EventsComponent {
  activeTab = signal<'upcoming' | 'going' | 'past'>('upcoming');

  events = signal<Event[]>([
    { id: '1', title: 'Downtown Car Meet', description: 'Monthly car meet', coverImage: '', date: 'Dec 15, 2024', time: '6:00 PM', location: 'Downtown Plaza', attendeeCount: 245, isAttending: true, isInterested: false, organizer: 'Car Club' },
    { id: '2', title: 'EV Showcase 2024', description: 'Electric vehicle exhibition', coverImage: '', date: 'Dec 20, 2024', time: '10:00 AM', location: 'Convention Center', attendeeCount: 1200, isAttending: false, isInterested: true, organizer: 'EV Association' },
    { id: '3', title: 'DIY Workshop: Brake Maintenance', description: 'Learn brake basics', coverImage: '', date: 'Dec 22, 2024', time: '2:00 PM', location: 'Community Garage', attendeeCount: 45, isAttending: false, isInterested: false, organizer: 'DIY Mechanics' }
  ]);

  getMonth(date: string): string {
    return date.split(' ')[0].substring(0, 3).toUpperCase();
  }

  getDay(date: string): string {
    return date.split(' ')[1].replace(',', '');
  }

  toggleAttending(event: Event) {
    this.events.update(events => 
      events.map(e => e.id === event.id ? { ...e, isAttending: !e.isAttending, isInterested: false } : e)
    );
  }

  toggleInterested(event: Event) {
    this.events.update(events => 
      events.map(e => e.id === event.id ? { ...e, isInterested: !e.isInterested, isAttending: false } : e)
    );
  }
}
