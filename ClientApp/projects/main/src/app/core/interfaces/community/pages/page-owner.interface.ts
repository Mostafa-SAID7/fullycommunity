// Interface matching backend DTO: PageOwnerDto

export interface PageOwner {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isVerified: boolean;
}
