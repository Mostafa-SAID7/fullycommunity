import { BaseEntity } from '../../base/entity.interface';
import { PagedResponse } from '../../base/api-response.interface';

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
export type ProductCondition = 'new' | 'used' | 'refurbished';

export interface Product extends BaseEntity {
  name: string;
  description: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  quantity: number;
  status: ProductStatus;
  condition: ProductCondition;
  categoryId: string;
  categoryName: string;
  brandId?: string;
  brandName?: string;
  sellerId: string;
  sellerName: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  viewCount: number;
  orderCount: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductsListResponse extends PagedResponse<Product> {}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  productCount: number;
  isActive: boolean;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  productCount: number;
  isActive: boolean;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
  pendingApproval: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  quantity: number;
  categoryId: string;
  brandId?: string;
  condition: ProductCondition;
  specifications?: ProductSpecification[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  status?: ProductStatus;
  isFeatured?: boolean;
}
