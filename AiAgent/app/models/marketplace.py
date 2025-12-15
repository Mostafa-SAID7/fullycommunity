"""Marketplace models - Products, Auctions, Orders, Sellers."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from enum import Enum

from .common import MediaModel


# ═══════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════

class MarketplaceCategory(str, Enum):
    PARTS = "parts"
    ACCESSORIES = "accessories"
    TOOLS = "tools"
    ELECTRONICS = "electronics"
    TIRES_WHEELS = "tires_wheels"
    INTERIOR = "interior"
    EXTERIOR = "exterior"
    PERFORMANCE = "performance"
    MAINTENANCE = "maintenance"
    OTHER = "other"


class ListingType(str, Enum):
    FIXED_PRICE = "fixed_price"
    AUCTION = "auction"
    BEST_OFFER = "best_offer"


class ListingStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    SOLD = "sold"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class ProductCondition(str, Enum):
    NEW = "new"
    LIKE_NEW = "like_new"
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    FOR_PARTS = "for_parts"


class WarrantyType(str, Enum):
    NONE = "none"
    MANUFACTURER = "manufacturer"
    SELLER = "seller"
    EXTENDED = "extended"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


# ═══════════════════════════════════════════════════════════════════════════
# SELLER
# ═══════════════════════════════════════════════════════════════════════════

class SellerModel(BaseModel):
    """Seller profile."""
    id: UUID
    user_id: UUID
    store_name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    rating: float = 0.0
    rating_count: int = 0
    total_sales: int = 0
    is_verified: bool = False
    location: Optional[str] = None
    response_time: Optional[str] = None  # e.g., "within 24 hours"
    created_at: datetime


# ═══════════════════════════════════════════════════════════════════════════
# PRODUCT
# ═══════════════════════════════════════════════════════════════════════════

class VehicleCompatibilityModel(BaseModel):
    """Vehicle compatibility info."""
    make: str
    model: str
    year_from: int
    year_to: int
    trim: Optional[str] = None
    engine: Optional[str] = None


class ProductSubCategoryModel(BaseModel):
    """Product subcategory."""
    id: UUID
    name: str
    slug: Optional[str] = None
    parent_category: MarketplaceCategory


class ProductModel(BaseModel):
    """Full product model."""
    id: UUID
    seller_id: UUID
    seller: Optional[SellerModel] = None
    title: str
    subtitle: Optional[str] = None
    description: str
    slug: Optional[str] = None
    sku: str
    category: MarketplaceCategory
    sub_category_id: Optional[UUID] = None
    sub_category: Optional[ProductSubCategoryModel] = None
    listing_type: ListingType = ListingType.FIXED_PRICE
    status: ListingStatus = ListingStatus.DRAFT
    condition: ProductCondition
    condition_description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    min_offer_price: Optional[float] = None
    accepts_best_offer: bool = False
    currency: str = "USD"
    quantity: int = 1
    sold_quantity: int = 0
    images: list[MediaModel] = []
    video_url: Optional[str] = None
    is_universal: bool = False
    compatibility: list[VehicleCompatibilityModel] = []
    brand: Optional[str] = None
    manufacturer: Optional[str] = None
    part_number: Optional[str] = None
    oem_number: Optional[str] = None
    weight_kg: Optional[float] = None
    dimensions: Optional[str] = None  # LxWxH
    warranty_type: WarrantyType = WarrantyType.NONE
    warranty_months: int = 0
    warranty_description: Optional[str] = None
    free_shipping: bool = False
    shipping_cost: Optional[float] = None
    local_pickup_available: bool = False
    ships_from: Optional[str] = None
    handling_days: int = 1
    view_count: int = 0
    watch_count: int = 0
    tags: list[str] = []
    is_featured: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime


class ProductListModel(BaseModel):
    """Product list item (lighter version)."""
    id: UUID
    seller_id: UUID
    seller_name: str
    seller_rating: float = 0.0
    title: str
    slug: Optional[str] = None
    category: MarketplaceCategory
    condition: ProductCondition
    price: float
    original_price: Optional[float] = None
    currency: str = "USD"
    image_url: Optional[str] = None
    free_shipping: bool = False
    is_featured: bool = False
    location: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# AUCTION
# ═══════════════════════════════════════════════════════════════════════════

class AuctionModel(BaseModel):
    """Auction listing."""
    id: UUID
    product_id: UUID
    product: ProductListModel
    starting_price: float
    current_price: float
    reserve_price: Optional[float] = None
    buy_now_price: Optional[float] = None
    bid_count: int = 0
    highest_bidder_id: Optional[UUID] = None
    start_time: datetime
    end_time: datetime
    is_reserve_met: bool = False
    status: str = "active"


class BidModel(BaseModel):
    """Auction bid."""
    id: UUID
    auction_id: UUID
    bidder_id: UUID
    amount: float
    is_winning: bool = False
    created_at: datetime


# ═══════════════════════════════════════════════════════════════════════════
# ORDER
# ═══════════════════════════════════════════════════════════════════════════

class OrderItemModel(BaseModel):
    """Order line item."""
    id: UUID
    product_id: UUID
    product_title: str
    product_image_url: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float


class ShippingAddressModel(BaseModel):
    """Shipping address."""
    full_name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str
    phone: Optional[str] = None


class OrderModel(BaseModel):
    """Order model."""
    id: UUID
    order_number: str
    buyer_id: UUID
    seller_id: UUID
    items: list[OrderItemModel]
    subtotal: float
    shipping_cost: float
    tax: float
    total: float
    currency: str = "USD"
    status: OrderStatus = OrderStatus.PENDING
    shipping_address: ShippingAddressModel
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None


# ═══════════════════════════════════════════════════════════════════════════
# CART
# ═══════════════════════════════════════════════════════════════════════════

class CartItemModel(BaseModel):
    """Shopping cart item."""
    id: UUID
    product_id: UUID
    product: ProductListModel
    quantity: int
    added_at: datetime


class CartModel(BaseModel):
    """Shopping cart."""
    id: UUID
    user_id: UUID
    items: list[CartItemModel] = []
    subtotal: float = 0.0
    item_count: int = 0
