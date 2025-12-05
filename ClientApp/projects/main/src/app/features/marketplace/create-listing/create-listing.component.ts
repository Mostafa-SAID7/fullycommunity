import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceService, CreateProductRequest, MarketplaceCategory, ProductCondition, WarrantyType } from '../../../core/services/commerce/marketplace.service';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-4xl mx-auto px-4 py-4">
          <div class="flex items-center gap-4">
            <a routerLink="/marketplace/sell" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </a>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ isEdit ? 'Edit Listing' : 'Create New Listing' }}</h1>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
          <!-- Basic Info -->
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input type="text" [(ngModel)]="product.title" maxlength="80"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <p class="text-xs text-gray-500 mt-1">{{ product.title?.length || 0 }}/80</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                <input type="text" [(ngModel)]="product.subtitle" maxlength="55"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea [(ngModel)]="product.description" rows="5"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select [(ngModel)]="product.category"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    @for (cat of categories; track cat) {
                      <option [value]="cat">{{ cat }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition *</label>
                  <select [(ngModel)]="product.condition"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    @for (cond of conditions; track cond) {
                      <option [value]="cond">{{ cond }}</option>
                    }
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- Pricing -->
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (USD) *</label>
                <input type="number" [(ngModel)]="product.price" min="0" step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Price (USD)</label>
                <input type="number" [(ngModel)]="product.originalPrice" min="0" step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity *</label>
                <input type="number" [(ngModel)]="product.quantity" min="1"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div class="flex items-end">
                <label class="flex items-center gap-2">
                  <input type="checkbox" [(ngModel)]="product.acceptsBestOffer" class="rounded text-blue-600">
                  <span class="text-sm text-gray-700 dark:text-gray-300">Accept Best Offer</span>
                </label>
              </div>
            </div>
          </section>

          <!-- Product Details -->
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Details</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                <input type="text" [(ngModel)]="product.brand"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manufacturer</label>
                <input type="text" [(ngModel)]="product.manufacturer"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Part Number</label>
                <input type="text" [(ngModel)]="product.partNumber"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OEM Number</label>
                <input type="text" [(ngModel)]="product.oemNumber"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
            </div>
          </section>

          <!-- Shipping -->
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping</h2>
            <div class="space-y-4">
              <label class="flex items-center gap-2">
                <input type="checkbox" [(ngModel)]="product.freeShipping" class="rounded text-blue-600">
                <span class="text-sm text-gray-700 dark:text-gray-300">Free Shipping</span>
              </label>
              @if (!product.freeShipping) {
                <div class="w-1/2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Cost (USD)</label>
                  <input type="number" [(ngModel)]="product.shippingCost" min="0" step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                </div>
              }
              <label class="flex items-center gap-2">
                <input type="checkbox" [(ngModel)]="product.localPickupAvailable" class="rounded text-blue-600">
                <span class="text-sm text-gray-700 dark:text-gray-300">Local Pickup Available</span>
              </label>
            </div>
          </section>

          <!-- Warranty -->
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Warranty</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Warranty Type</label>
                <select [(ngModel)]="product.warrantyType"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  @for (type of warrantyTypes; track type) {
                    <option [value]="type">{{ type }}</option>
                  }
                </select>
              </div>
              @if (product.warrantyType !== 'None') {
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Warranty Duration (months)</label>
                  <input type="number" [(ngModel)]="product.warrantyMonths" min="1"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                </div>
              }
            </div>
          </section>

          <!-- Actions -->
          <div class="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a routerLink="/marketplace/sell" class="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              Cancel
            </a>
            <button (click)="saveDraft()" class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Save as Draft
            </button>
            <button (click)="publish()" [disabled]="!isValid() || saving()"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {{ saving() ? 'Saving...' : 'Publish Listing' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreateListingComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private marketplaceService = inject(MarketplaceService);

  isEdit = false;
  editId = '';
  saving = signal(false);

  product: CreateProductRequest & { quantity?: number; freeShipping?: boolean; shippingCost?: number; localPickupAvailable?: boolean; warrantyMonths?: number } = {
    title: '',
    description: '',
    category: 'PartsServicing',
    condition: 'New',
    price: 0,
    quantity: 1,
    freeShipping: false,
    warrantyType: 'None'
  };

  categories: MarketplaceCategory[] = [
    'PartsServicing', 'AccessoriesAutomobilia', 'TyresWheels', 'CarCareProducts', 
    'Tools', 'CarCovers', 'BooksDVD', 'LifestyleAttire'
  ];

  conditions: ProductCondition[] = ['New', 'LikeNew', 'Excellent', 'Good', 'Fair', 'ForParts', 'Refurbished'];
  warrantyTypes: WarrantyType[] = ['None', 'Seller', 'Manufacturer', 'Extended', 'Lifetime'];

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.editId = params['id'];
        this.loadProduct(params['id']);
      }
    });
  }

  loadProduct(id: string) {
    this.marketplaceService.getProduct(id).subscribe(product => {
      this.product = {
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        category: product.category,
        condition: product.condition,
        price: product.price,
        originalPrice: product.originalPrice,
        acceptsBestOffer: product.acceptsBestOffer,
        quantity: product.quantity,
        brand: product.brand,
        manufacturer: product.manufacturer,
        partNumber: product.partNumber,
        oemNumber: product.oemNumber,
        freeShipping: product.freeShipping,
        shippingCost: product.shippingCost,
        localPickupAvailable: product.localPickupAvailable,
        warrantyType: product.warrantyType,
        warrantyMonths: product.warrantyMonths
      };
    });
  }

  isValid(): boolean {
    return !!(this.product.title && this.product.description && this.product.price > 0);
  }

  saveDraft() {
    this.save(false);
  }

  publish() {
    this.save(true);
  }

  private save(publish: boolean) {
    if (!this.isValid()) return;
    
    this.saving.set(true);
    const request = this.isEdit
      ? this.marketplaceService.updateProduct(this.editId, this.product)
      : this.marketplaceService.createProduct(this.product);

    request.subscribe({
      next: (product) => {
        if (publish) {
          this.marketplaceService.publishProduct(product.id).subscribe({
            next: () => this.router.navigate(['/marketplace/sell']),
            error: () => this.saving.set(false)
          });
        } else {
          this.router.navigate(['/marketplace/sell']);
        }
      },
      error: () => this.saving.set(false)
    });
  }
}
