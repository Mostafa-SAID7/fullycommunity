import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ActivityLogEntry {
  id: string;
  action: string;
  actionType: string;
  description: string;
  performedBy: string;
  performedById: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details?: any;
  resourceType?: string;
  resourceId?: string;
}

export interface ActivityLogResponse {
  entries: ActivityLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/admin/activity-log`;

  getActivityLog(page: number = 1, pageSize: number = 20, filters: any = {}): Observable<ActivityLogResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters
    });

    // For now, return mock data
    return this.getMockActivityLog(page, pageSize, filters);
  }

  logActivity(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, entry);
  }

  exportActivityLog(filters: any = {}): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { 
      params: filters,
      responseType: 'blob'
    });
  }

  // Mock data for development
  private getMockActivityLog(page: number, pageSize: number, filters: any): Observable<ActivityLogResponse> {
    const mockEntries: ActivityLogEntry[] = [
      {
        id: '1',
        action: 'User Account Created',
        actionType: 'user_created',
        description: 'New user account created for john.doe@example.com',
        performedBy: 'Super Admin',
        performedById: 'admin-1',
        timestamp: new Date(Date.now() - 300000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          userId: 'user-123',
          email: 'john.doe@example.com',
          role: 'User'
        },
        resourceType: 'User',
        resourceId: 'user-123'
      },
      {
        id: '2',
        action: 'Content Moderated',
        actionType: 'content_moderated',
        description: 'Video content flagged and removed for policy violation',
        performedBy: 'Content Moderator',
        performedById: 'mod-1',
        timestamp: new Date(Date.now() - 600000),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          contentId: 'video-456',
          reason: 'Inappropriate content',
          action: 'removed'
        },
        resourceType: 'Video',
        resourceId: 'video-456'
      },
      {
        id: '3',
        action: 'System Settings Updated',
        actionType: 'settings_changed',
        description: 'Updated system maintenance window settings',
        performedBy: 'Super Admin',
        performedById: 'admin-1',
        timestamp: new Date(Date.now() - 900000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          setting: 'maintenance_window',
          oldValue: '02:00-04:00',
          newValue: '01:00-03:00'
        },
        resourceType: 'SystemSettings',
        resourceId: 'maintenance_window'
      },
      {
        id: '4',
        action: 'Admin Login',
        actionType: 'login',
        description: 'Administrator logged into the system',
        performedBy: 'Community Admin',
        performedById: 'admin-2',
        timestamp: new Date(Date.now() - 1200000),
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        details: {
          loginMethod: 'email_password',
          sessionId: 'sess-789'
        }
      },
      {
        id: '5',
        action: 'User Role Updated',
        actionType: 'user_updated',
        description: 'User role changed from User to Moderator',
        performedBy: 'Super Admin',
        performedById: 'admin-1',
        timestamp: new Date(Date.now() - 1500000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          userId: 'user-789',
          oldRole: 'User',
          newRole: 'Moderator'
        },
        resourceType: 'User',
        resourceId: 'user-789'
      },
      {
        id: '6',
        action: 'Content Approved',
        actionType: 'content_moderated',
        description: 'Pending video content approved for publication',
        performedBy: 'Content Moderator',
        performedById: 'mod-1',
        timestamp: new Date(Date.now() - 1800000),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          contentId: 'video-101',
          action: 'approved',
          reviewNotes: 'Content meets community guidelines'
        },
        resourceType: 'Video',
        resourceId: 'video-101'
      },
      {
        id: '7',
        action: 'User Account Suspended',
        actionType: 'user_updated',
        description: 'User account suspended for policy violations',
        performedBy: 'User Manager',
        performedById: 'admin-3',
        timestamp: new Date(Date.now() - 2100000),
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
        details: {
          userId: 'user-456',
          reason: 'Multiple policy violations',
          suspensionDuration: '7 days'
        },
        resourceType: 'User',
        resourceId: 'user-456'
      },
      {
        id: '8',
        action: 'Admin Logout',
        actionType: 'logout',
        description: 'Administrator logged out of the system',
        performedBy: 'Reports Admin',
        performedById: 'admin-4',
        timestamp: new Date(Date.now() - 2400000),
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          sessionDuration: '2h 15m',
          sessionId: 'sess-456'
        }
      }
    ];

    // Apply filters
    let filteredEntries = mockEntries;
    
    if (filters.actionType) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.actionType === filters.actionType
      );
    }
    
    if (filters.user) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.performedBy.toLowerCase().includes(filters.user.toLowerCase())
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredEntries = filteredEntries.filter(entry => 
        entry.timestamp >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filteredEntries = filteredEntries.filter(entry => 
        entry.timestamp <= toDate
      );
    }

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

    const response: ActivityLogResponse = {
      entries: paginatedEntries,
      total: filteredEntries.length,
      page,
      pageSize
    };

    return of(response);
  }
}