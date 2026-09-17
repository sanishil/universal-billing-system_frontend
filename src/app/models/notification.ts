export interface Notification {
  id: string;
  type: 'EMAIL' | 'SMS';
  recipient: string;
  message: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  sentAt: string;
}
