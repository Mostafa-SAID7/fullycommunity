// Enums matching backend: CommunityCar.Domain.Enums.Community.Reviews

export enum OwnershipStatus {
  CurrentOwner = 0,
  PreviousOwner = 1,
  TestDrive = 2,
  Rented = 3
}

export enum ReviewStatus {
  Draft = 0,
  Published = 1,
  UnderReview = 2,
  Rejected = 3,
  Archived = 4
}

export enum ReviewSubjectType {
  Car = 0,
  Product = 1,
  Service = 2,
  Garage = 3,
  Dealership = 4
}
