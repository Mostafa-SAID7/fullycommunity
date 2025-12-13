export interface GroupEvent {
    id: string;
    title: string;
    description: string | null;
    startDate: string;
    endDate: string;
    location: string | null;
    imageUrl: string | null;
    groupId: string;
    groupName: string;
    attendeeCount: number;
    isAttending: boolean;
}
