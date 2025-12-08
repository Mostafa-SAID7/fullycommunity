/**
 * Base Entity Interfaces
 * Common entity structures
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface TimestampedEntity {
  createdAt: string;
  updatedAt?: string;
}

export interface SoftDeletable {
  isDeleted: boolean;
  deletedAt?: string;
}
