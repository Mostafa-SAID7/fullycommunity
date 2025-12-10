/**
 * Professional Profile
 * Professional/business information
 */
export interface ProfessionalProfile {
  userId: string;
  
  // Professional Info
  title: string | null;
  company: string | null;
  industry: string | null;
  yearsOfExperience: number | null;
  
  // Skills
  skills: Skill[];
  certifications: Certification[];
  
  // Work Experience
  workExperience: WorkExperience[];
  
  // Education
  education: Education[];
  
  // Portfolio
  portfolioItems: PortfolioItem[];
  
  // Services
  offersServices: boolean;
  serviceCategories: string[];
  hourlyRate: number | null;
  currency: string | null;
  
  // Availability
  isAvailableForHire: boolean;
  availabilityStatus: AvailabilityStatus;
  
  updatedAt: string;
}

/**
 * Skill
 */
export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  yearsOfExperience: number | null;
  endorsements: number;
  isVerified: boolean;
}

/**
 * Skill Level
 */
export enum SkillLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
  Expert = 3
}

/**
 * Certification
 */
export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  isVerified: boolean;
}

/**
 * Work Experience
 */
export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string | null;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  achievements: string[];
}

/**
 * Employment Type
 */
export enum EmploymentType {
  FullTime = 0,
  PartTime = 1,
  Contract = 2,
  Freelance = 3,
  Internship = 4,
  SelfEmployed = 5
}

/**
 * Education
 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  grade: string | null;
  description: string | null;
}

/**
 * Portfolio Item
 */
export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  thumbnailUrl: string | null;
  mediaUrls: string[];
  projectUrl: string | null;
  tags: string[];
  completedAt: string | null;
  displayOrder: number;
}

/**
 * Availability Status
 */
export enum AvailabilityStatus {
  Available = 0,
  Busy = 1,
  NotAvailable = 2
}

/**
 * Skill Endorsement
 */
export interface SkillEndorsement {
  id: string;
  skillId: string;
  endorserId: string;
  endorserName: string;
  endorserAvatarUrl: string | null;
  endorsedAt: string;
}
