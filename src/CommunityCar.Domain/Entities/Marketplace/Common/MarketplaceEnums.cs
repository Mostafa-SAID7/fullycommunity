namespace CommunityCar.Domain.Entities.Marketplace.Common;

// Product & Listing
public enum ListingStatus { Draft, PendingApproval, Active, Sold, Expired, Suspended, Deleted }
public enum ListingType { FixedPrice, Auction, BestOffer, Classified }
public enum ProductCondition { New, LikeNew, Excellent, Good, Fair, ForParts, Refurbished }
public enum SellerType { Individual, Dealer, Vendor, Manufacturer }

// Categories
public enum MarketplaceCategory
{
    PartsServicing,
    AccessoriesAutomobilia,
    Auctions,
    BooksDVD,
    CarCareProducts,
    CarCovers,
    ClassicCarDealers,
    EventsRallies,
    FinanceInsurance,
    FuelOils,
    LifestyleAttire,
    SpecialistsRestoration,
    Storage,
    Tools,
    TrackdaysOrganisers,
    Transport,
    TyresWheels,
    ValetingDetailing
}

// Orders & Shipping
public enum OrderStatus { Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded, Disputed }
public enum PaymentMethod { Card, BankTransfer, Cash, Escrow, Financing }
public enum ShippingMethod { Standard, Express, Overnight, Pickup, FreightForwarder }
public enum ShippingStatus { Pending, LabelCreated, PickedUp, InTransit, OutForDelivery, Delivered, Exception }

// Auctions
public enum AuctionStatus { Scheduled, Active, Ended, Sold, Unsold, Cancelled }
public enum BidStatus { Active, Outbid, Won, Lost, Retracted }

// Warranty
public enum WarrantyType { None, Seller, Manufacturer, Extended, Lifetime }

// Offers
public enum OfferStatus { Pending, Accepted, Rejected, Countered, Expired, Withdrawn }
