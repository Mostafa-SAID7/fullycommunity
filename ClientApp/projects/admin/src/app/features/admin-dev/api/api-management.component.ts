import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
}

interface ApiEndpoint {
  id: string;
  path: string;
  method: string;
  description: string;
  isPublic: boolean;
  rateLimit: number;
  requestsToday: number;
  avgResponseTime: number;
  errorRate: number;
}

@Component({
  selector: 'app-api-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">API Management</h1>
          <p class="text-gray-600 mt-1">Manage API keys, endpoints, and rate limiting</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="generateApiKey()" 
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-11.83 1M9 7a2 2 0 012 2m4 0a6 6 0 01-11.83 1"/>
            </svg>
            Generate API Key
          </button>
          <button (click)="refreshData()" 
                  [disabled]="loading()"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            <svg class="w-4 h-4" [class.animate-spin]="loading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- API Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Requests Today</p>
              <p class="text-2xl font-bold text-gray-900">24,567</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Avg Response Time</p>
              <p class="text-2xl font-bold text-gray-900">145ms</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Error Rate</p>
              <p class="text-2xl font-bold text-gray-900">0.8%</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-11.83 1M9 7a2 2 0 012 2m4 0a6 6 0 01-11.83 1"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Active API Keys</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeApiKeys() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- API Keys Management -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">API Keys</h2>
        </div>
        
        <div class="p-6">
          <div *ngIf="loading()" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="text-gray-500 mt-2">Loading API keys...</p>
          </div>

          <div *ngIf="!loading() && apiKeys().length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-11.83 1M9 7a2 2 0 012 2m4 0a6 6 0 01-11.83 1"/>
            </svg>
            <p>No API keys found</p>
            <button (click)="generateApiKey()" 
                    class="mt-2 text-primary hover:text-primary-hover font-medium">
              Generate your first API key
            </button>
          </div>

          <div *ngIf="!loading() && apiKeys().length > 0" class="space-y-4">
            <div *ngFor="let apiKey of apiKeys()" 
                 class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-semibold text-gray-900">{{ apiKey.name }}</h3>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="apiKey.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ apiKey.isActive ? 'Active' : 'Inactive' }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {{ apiKey.rateLimit }} req/min
                    </span>
                  </div>
                  
                  <div class="mb-3">
                    <div class="flex items-center gap-2">
                      <code class="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{{ maskApiKey(apiKey.key) }}</code>
                      <button (click)="copyApiKey(apiKey.key)" 
                              class="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span class="font-medium">Created:</span>
                      <span class="ml-1">{{ apiKey.createdAt | date:'short' }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Last Used:</span>
                      <span class="ml-1">{{ apiKey.lastUsed | date:'short' }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Usage Count:</span>
                      <span class="ml-1">{{ apiKey.usageCount | number }}</span>
                    </div>
                    <div>
                      <span class="font-medium">Permissions:</span>
                      <span class="ml-1">{{ apiKey.permissions.length }} granted</span>
                    </div>
                  </div>

                  <div class="mt-2">
                    <div class="flex flex-wrap gap-1">
                      <span *ngFor="let permission of apiKey.permissions" 
                            class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {{ permission }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <button (click)="editApiKey(apiKey)" 
                          class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button (click)="toggleApiKey(apiKey)" 
                          class="p-2 transition-colors"
                          [class]="apiKey.isActive ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path *ngIf="apiKey.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      <path *ngIf="!apiKey.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                  <button (click)="deleteApiKey(apiKey)" 
                          class="p-2 text-red-400 hover:text-red-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- API Endpoints -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">API Endpoints</h2>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div *ngFor="let endpoint of apiEndpoints()" 
                 class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="px-2 py-1 text-xs font-medium rounded" 
                          [class]="getMethodClass(endpoint.method)">
                      {{ endpoint.method }}
                    </span>
                    <code class="text-sm font-mono text-gray-900">{{ endpoint.path }}</code>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" 
                          [class]="endpoint.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ endpoint.isPublic ? 'Public' : 'Private' }}
                    </span>
                  </div>
                  
                  <p class="text-sm text-gray-600 mb-3">{{ endpoint.description }}</p>
                  
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span class="text-gray-600">Rate Limit:</span>
                      <span class="ml-1 font-medium">{{ endpoint.rateLimit }}/min</span>
                    </div>
                    <div>
                      <span class="text-gray-600">Requests Today:</span>
                      <span class="ml-1 font-medium">{{ endpoint.requestsToday | number }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600">Avg Response:</span>
                      <span class="ml-1 font-medium">{{ endpoint.avgResponseTime }}ms</span>
                    </div>
                    <div>
                      <span class="text-gray-600">Error Rate:</span>
                      <span class="ml-1 font-medium" 
                            [class]="endpoint.errorRate > 5 ? 'text-red-600' : 'text-green-600'">
                        {{ endpoint.errorRate }}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <button (click)="viewEndpointDetails(endpoint)" 
                          class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button (click)="configureEndpoint(endpoint)" 
                          class="p-2 text-blue-400 hover:text-blue-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApiManagementComponent implements OnInit {
  loading = signal(false);
  apiKeys = signal<ApiKey[]>([]);
  apiEndpoints = signal<ApiEndpoint[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    
    // Mock data
    setTimeout(() => {
      const mockApiKeys: ApiKey[] = [
        {
          id: '1',
          name: 'Mobile App API Key',
          key: 'cc_live_1234567890abcdef1234567890abcdef',
          permissions: ['users.read', 'content.read', 'content.create'],
          rateLimit: 1000,
          isActive: true,
          createdAt: new Date(Date.now() - 86400000 * 7),
          lastUsed: new Date(Date.now() - 3600000),
          usageCount: 15420
        },
        {
          id: '2',
          name: 'Analytics Dashboard',
          key: 'cc_live_abcdef1234567890abcdef1234567890',
          permissions: ['analytics.read', 'reports.read'],
          rateLimit: 500,
          isActive: true,
          createdAt: new Date(Date.now() - 86400000 * 14),
          lastUsed: new Date(Date.now() - 7200000),
          usageCount: 8930
        },
        {
          id: '3',
          name: 'Third Party Integration',
          key: 'cc_test_1234567890abcdef1234567890abcdef',
          permissions: ['webhooks.read'],
          rateLimit: 100,
          isActive: false,
          createdAt: new Date(Date.now() - 86400000 * 30),
          lastUsed: new Date(Date.now() - 86400000 * 5),
          usageCount: 245
        }
      ];

      const mockEndpoints: ApiEndpoint[] = [
        {
          id: '1',
          path: '/api/v1/users',
          method: 'GET',
          description: 'Retrieve user information',
          isPublic: false,
          rateLimit: 100,
          requestsToday: 5420,
          avgResponseTime: 120,
          errorRate: 0.5
        },
        {
          id: '2',
          path: '/api/v1/content/posts',
          method: 'POST',
          description: 'Create new content post',
          isPublic: false,
          rateLimit: 50,
          requestsToday: 892,
          avgResponseTime: 250,
          errorRate: 1.2
        },
        {
          id: '3',
          path: '/api/v1/health',
          method: 'GET',
          description: 'System health check endpoint',
          isPublic: true,
          rateLimit: 1000,
          requestsToday: 12450,
          avgResponseTime: 45,
          errorRate: 0.1
        }
      ];

      this.apiKeys.set(mockApiKeys);
      this.apiEndpoints.set(mockEndpoints);
      this.loading.set(false);
    }, 1000);
  }

  refreshData() {
    this.loadData();
  }

  activeApiKeys(): number {
    return this.apiKeys().filter(key => key.isActive).length;
  }

  generateApiKey() {
    console.log('Generate new API key');
  }

  editApiKey(apiKey: ApiKey) {
    console.log('Edit API key:', apiKey);
  }

  toggleApiKey(apiKey: ApiKey) {
    apiKey.isActive = !apiKey.isActive;
    console.log('Toggle API key:', apiKey);
  }

  deleteApiKey(apiKey: ApiKey) {
    if (confirm(`Are you sure you want to delete the API key "${apiKey.name}"?`)) {
      const currentKeys = this.apiKeys();
      this.apiKeys.set(currentKeys.filter(k => k.id !== apiKey.id));
      console.log('Delete API key:', apiKey);
    }
  }

  copyApiKey(key: string) {
    navigator.clipboard.writeText(key).then(() => {
      console.log('API key copied to clipboard');
    });
  }

  maskApiKey(key: string): string {
    if (key.length <= 8) return key;
    return key.substring(0, 8) + '...' + key.substring(key.length - 8);
  }

  viewEndpointDetails(endpoint: ApiEndpoint) {
    console.log('View endpoint details:', endpoint);
  }

  configureEndpoint(endpoint: ApiEndpoint) {
    console.log('Configure endpoint:', endpoint);
  }

  getMethodClass(method: string): string {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PATCH': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}