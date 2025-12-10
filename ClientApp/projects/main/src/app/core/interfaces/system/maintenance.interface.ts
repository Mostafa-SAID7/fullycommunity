/**
 * Maintenance Mode Interface
 */

export interface MaintenanceMode {
  id: string;
  isActive: boolean;
  title: string;
  message: string;
  estimatedDuration: string | null;
  startTime: string;
  endTime: string | null;
  allowedRoles: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceStatus {
  isMaintenanceMode: boolean;
  maintenance: MaintenanceMode | null;
  userCanAccess: boolean;
  redirectUrl: string | null;
}

export interface ComingSoonMode {
  id: string;
  isActive: boolean;
  title: string;
  description: string;
  launchDate: string | null;
  features: string[];
  notifyEmail: boolean;
  socialLinks: SocialLink[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ComingSoonStatus {
  isComingSoonMode: boolean;
  comingSoon: ComingSoonMode | null;
  userCanAccess: boolean;
}

export interface SystemStatus {
  maintenance: MaintenanceStatus;
  comingSoon: ComingSoonStatus;
  timestamp: string;
}