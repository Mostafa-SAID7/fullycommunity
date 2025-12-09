/**
 * Listing Status
 */
export enum ListingStatus {
  Draft = 0,
  PendingApproval = 1,
  Active = 2,
  Sold = 3,
  Expired = 4,
  Suspended = 5,
  Deleted = 6
}

/**
 * Listing Type
 */
export enum ListingType {
  FixedPrice = 0,
  Auction = 1,
  BestOffer = 2,
  Classified = 3
}

/**
 * Product Condition
 */
export enum ProductCondition {
  New = 0,
  LikeNew = 1,
  Excellent = 2,
  Good = 3,
  Fair = 4,
  ForParts = 5,
  Refurbished = 6
}

/**
 * Seller Type
 */
export enum SellerType {
  Individual = 0,
  Dealer = 1,
  Vendor = 2,
  Manufacturer = 3
}

/**
 * Seller Status
 */
export enum SellerStatus {
  Active = 0,
  Inactive = 1,
  Suspended = 2,
  Banned = 3
}

/**
 * Marketplace Category
 */
export enum MarketplaceCategory {
  PartsServicing = 0,
  AccessoriesAutomobilia = 1,
  Auctions = 2,
  BooksDVD = 3,
  CarCareProducts = 4,
  CarCovers = 5,
  ClassicCarDealers = 6,
  EventsRallies = 7,
  FinanceInsurance = 8,
  FuelOils = 9,
  LifestyleAttire = 10,
  SpecialistsRestoration = 11,
  Storage = 12,
  Tools = 13,
  TrackdaysOrganisers = 14,
  Transport = 15,
  TyresWheels = 16,
  ValetingDetailing = 17
}

/**
 * Order Status
 */
export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Refunded = 6,
  Disputed = 7
}

/**
 * Payment Method
 */
export enum PaymentMethod {
  Card = 0,
  BankTransfer = 1,
  Cash = 2,
  Escrow = 3,
  Financing = 4
}

/**
 * Shipping Method
 */
export enum ShippingMethod {
  Standard = 0,
  Express = 1,
  Overnight = 2,
  Pickup = 3,
  FreightForwarder = 4
}

/**
 * Shipping Status
 */
export enum ShippingStatus {
  Pending = 0,
  LabelCreated = 1,
  PickedUp = 2,
  InTransit = 3,
  OutForDelivery = 4,
  Delivered = 5,
  Exception = 6
}

/**
 * Auction Status
 */
export enum AuctionStatus {
  Scheduled = 0,
  Active = 1,
  Ended = 2,
  Sold = 3,
  Unsold = 4,
  Cancelled = 5
}

/**
 * Bid Status
 */
export enum BidStatus {
  Active = 0,
  Outbid = 1,
  Won = 2,
  Lost = 3,
  Retracted = 4
}

/**
 * Warranty Type
 */
export enum WarrantyType {
  None = 0,
  Seller = 1,
  Manufacturer = 2,
  Extended = 3,
  Lifetime = 4
}

/**
 * Offer Status
 */
export enum OfferStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Countered = 3,
  Expired = 4,
  Withdrawn = 5
}
