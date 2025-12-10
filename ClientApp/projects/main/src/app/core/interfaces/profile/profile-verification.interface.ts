/**
 * Verification Request
 */
export interface VerificationRequest {
  id: string;
  userId: string;
  verificationType: VerificationType;
  status: VerificationRequestStatus;
  
  // Documents
  documentType: string | null;
  documentUrls: string[];
  
  // Business Info (for business verification)
  businessName: string | null;
  businessRegistrationNumber: string | null;
  businessAddress: string | null;
  
  // Social Proof
  socialLinks: string[];
  websiteUrl: string | null;
  
  // Additional Info
  reason: string | null;
  additionalInfo: string | null;
  
  // Review
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  
  // Timestamps
  submittedAt: string;
  updatedAt: string;
}

/**
 * Verification Type
 */
export enum VerificationType {
  Identity = 0,
  Business = 1,
  Creator = 2,
  Professional = 3,
  Celebrity = 4,
  Organization = 5
}

/**
 * Verification Request Status
 */
export enum VerificationRequestStatus {
  Pending = 0,
  UnderReview = 1,
  Approved = 2,
  Rejected = 3,
  RequiresMoreInfo = 4
}

/**
 * Verification Badge
 */
export interface VerificationBadge {
  id: string;
  userId: string;
  badgeType: VerificationType;
  issuedAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

/**
 * Submit Verification Request
 */
export interface SubmitVerificationRequest {
  verificationType: VerificationType;
  documentType: string | null;
  documentUrls: string[];
  businessName: string | null;
  businessRegistrationNumber: string | null;
  businessAddress: string | null;
  socialLinks: string[];
  websiteUrl: string | null;
  reason: string | null;
  additionalInfo: string | null;
}
