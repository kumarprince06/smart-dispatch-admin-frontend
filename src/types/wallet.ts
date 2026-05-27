export interface WalletLedgerResponse {
  id: number;
  userId: number;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  source: 'PAYMENT' | 'REFUND' | 'TOP_UP' | 'CASHBACK' | 'PROMO';
  referenceId?: string;
  description?: string;
  balanceAfter?: number;
  createdAt: string;
}

export interface PaginatedLedgerResponse {
  content: WalletLedgerResponse[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: any;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
