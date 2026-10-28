export type BillEmailStatus = 'QUEUED' | 'SENT' | 'FAILED';

/** POST /bills/:id/send-email */
export interface SendBillEmailRequest {
  to?: string;          // default: customer email
  cc?: string[];
  message?: string;
  attachPdf?: boolean;  // default true
}

/** 202 response of POST /bills/:id/send-email */
export interface SendBillEmailResponse {
  emailLogId: number;
  status: BillEmailStatus;
}

/** GET /bills/:id/emails */
export interface BillEmailLog {
  id: number;
  toEmail: string;
  type: 'BILL' | 'BILL_WITH_INVITE';
  status: BillEmailStatus;
  error?: string | null;
  createdAt: string;
  sentAt?: string | null;
}
