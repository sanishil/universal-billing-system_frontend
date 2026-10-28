export type NotificationType = 'EMAIL' | 'SMS' | 'BILL_RECEIVED' | 'BILL_EMAILED' | 'BILL_VIEWED';

export interface Notification {
  id: string;
  type: NotificationType;
  recipient: string;
  message: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  sentAt: string;
  /** Set for the BILL_* types */
  billId?: string;
}
