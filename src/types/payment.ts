export interface PaymentResponse {
  paymentId: number;
  transactionId: string;
  orderId: number;
  amount: number;
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'CASH_ON_DELIVERY';
  status: 'INITIATED' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  providerTransactionId?: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaginatedPaymentResponse {
  content: PaymentResponse[];
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
