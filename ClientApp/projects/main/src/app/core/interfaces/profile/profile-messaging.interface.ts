/**
 * Profile Message
 * Direct message to profile owner
 */
export interface ProfileMessage {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatarUrl: string | null;
  toUserId: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  parentMessageId: string | null;
  sentAt: string;
  readAt: string | null;
}

/**
 * Contact Form
 * Contact form for profile
 */
export interface ContactForm {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  fields: ContactFormField[];
  isEnabled: boolean;
  requiresLogin: boolean;
  autoReply: string | null;
  notificationEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact Form Field
 */
export interface ContactFormField {
  id: string;
  name: string;
  label: string;
  type: ContactFieldType;
  isRequired: boolean;
  placeholder: string | null;
  options: string[] | null;
  validation: string | null;
  displayOrder: number;
}

/**
 * Contact Field Type
 */
export enum ContactFieldType {
  Text = 0,
  Email = 1,
  Phone = 2,
  Textarea = 3,
  Select = 4,
  Checkbox = 5,
  Radio = 6,
  Date = 7,
  Number = 8,
  Url = 9
}

/**
 * Contact Submission
 */
export interface ContactSubmission {
  id: string;
  formId: string;
  fromUserId: string | null;
  fromUserName: string | null;
  fromUserEmail: string | null;
  data: { [key: string]: any };
  isRead: boolean;
  isReplied: boolean;
  submittedAt: string;
  readAt: string | null;
}

/**
 * Testimonial
 */
export interface Testimonial {
  id: string;
  profileUserId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatarUrl: string | null;
  fromUserTitle: string | null;
  content: string;
  rating: number | null;
  isApproved: boolean;
  isPublic: boolean;
  createdAt: string;
  approvedAt: string | null;
}

/**
 * Send Message Request
 */
export interface SendMessageRequest {
  toUserId: string;
  subject: string | null;
  message: string;
  parentMessageId: string | null;
}

/**
 * Submit Contact Request
 */
export interface SubmitContactRequest {
  formId: string;
  data: { [key: string]: any };
}

/**
 * Add Testimonial Request
 */
export interface AddTestimonialRequest {
  profileUserId: string;
  content: string;
  rating: number | null;
}