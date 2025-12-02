import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const marketplaceRoutes: Routes = [
  { path: '', loadComponent: () => import('./marketplace-home/marketplace-home.component').then(m => m.MarketplaceHomeComponent) },
  { path: 'search', loadComponent: () => import('./product-search/product-search.component').then(m => m.ProductSearchComponent) },
  { path: 'category/:category', loadComponent: () => import('./product-category/product-category.component').then(m => m.ProductCategoryComponent) },
  { path: 'product/:id', loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'seller/:slug', loadComponent: () => import('./seller-store/seller-store.component').then(m => m.SellerStoreComponent) },
  { path: 'auctions', loadComponent: () => import('./auctions/auctions.component').then(m => m.AuctionsComponent) },
  { path: 'auction/:id', loadComponent: () => import('./auction-detail/auction-detail.component').then(m => m.AuctionDetailComponent) },
  { path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent), canActivate: [authGuard] },
  { path: 'checkout', loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [authGuard] },
  { path: 'wishlist', loadComponent: () => import('./wishlist/wishlist.component').then(m => m.WishlistComponent), canActivate: [authGuard] },
  { path: 'orders', loadComponent: () => import('./my-orders/my-orders.component').then(m => m.MyOrdersComponent), canActivate: [authGuard] },
  { path: 'order/:id', loadComponent: () => import('./order-detail/order-detail.component').then(m => m.OrderDetailComponent), canActivate: [authGuard] },
  { path: 'sell', loadComponent: () => import('./seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent), canActivate: [authGuard] },
  { path: 'sell/new', loadComponent: () => import('./create-listing/create-listing.component').then(m => m.CreateListingComponent), canActivate: [authGuard] },
  { path: 'sell/edit/:id', loadComponent: () => import('./create-listing/create-listing.component').then(m => m.CreateListingComponent), canActivate: [authGuard] }
];
