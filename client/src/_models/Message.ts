export interface Message {
    id: number;
    senderId: number;
    senderUsername: string;
    senderPhotoUrl: string;
    recepientUsername: string;
    recepientId: string;
    recepientPhotoUrl: string;
    content: string;
    dateRead: Date;
    messageSent: Date;
}