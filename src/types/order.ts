export type OrderStatus = 'CREATED' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'FAILED';
export type OrderPriority = 'STANDARD' | 'EXPRESS' | 'URGENT';
export type PackageType = 'DOCUMENT' | 'SMALL_PARCEL' | 'MEDIUM_PARCEL' | 'LARGE_PARCEL' | 'FRAGILE' | 'FOOD' | 'MEDICAL' | 'ELECTRONICS' | 'FURNITURE' | 'OTHER';

export interface OrderStatsResponse {
  totalOrders: number;
  createdOrders: number;
  assignedOrders: number;
  pickedUpOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  failedOrders: number;
}

export interface TimelineEntry {
  status: OrderStatus;
  description: string;
  updatedBy: string;
  timestamp: string;
}

export interface OrderResponse {
  orderId: number;
  trackingNumber: string;

  // Customer
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Driver
  driverId?: number;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;

  // Pickup
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupContactName: string;
  pickupContactPhone: string;

  // Drop
  dropAddress: string;
  dropLatitude: number;
  dropLongitude: number;
  dropContactName: string;
  dropContactPhone: string;

  // Package
  packageType: PackageType;
  packageDescription: string;
  packageWeightKg: number;

  // Status
  status: OrderStatus;
  priority: OrderPriority;

  // Pricing
  deliveryFee: number;
  distanceKm: number;

  // OTP
  pickupOtp?: string;
  deliveryOtp?: string;

  // Cancellation
  cancellationReason?: string;
  cancelledBy?: string;

  // Notes & Rating
  customerNotes?: string;
  customerRating?: number;
  customerFeedback?: string;

  // Timeline
  timeline: TimelineEntry[];

  // Timestamps
  assignedAt?: string;
  pickedUpAt?: string;
  inTransitAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  estimatedDeliveryAt?: string;
  createdAt: string;
}

export interface PaginatedOrderResponse {
  content: OrderResponse[];
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
