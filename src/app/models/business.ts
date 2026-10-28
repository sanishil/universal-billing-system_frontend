/** A business owned by the logged-in user; customers are created under one of these */
export interface Business {
  id: string;
  name: string;
  gstin?: string;
  address?: string;
  /** Supplier state for GST on bills issued by this business */
  stateCode: string;
}

export type BusinessPayload = Omit<Business, 'id'>;
