export interface CustomerResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  profilePictureUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  
  city?: string;
  state?: string;
  pincode?: string;
  
  walletBalance: number;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  
  active: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  
  createdAt: string;
  lastLoginAt?: string;
}

export interface PaginatedCustomerResponse {
  content: CustomerResponse[];
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
