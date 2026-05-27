export type DriverStatus = 'ONLINE' | 'OFFLINE' | 'ON_DELIVERY' | 'BUSY' | 'ON_BREAK' | 'SUSPENDED';
export type VehicleType = 'BICYCLE' | 'SCOOTER' | 'MOTORCYCLE' | 'CAR' | 'VAN' | 'TRUCK';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type DriverTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type DriverSkillTag = 'FRAGILE' | 'COLD_CHAIN' | 'HEAVY' | 'MEDICAL' | 'EXPRESS';

export interface DriverStatsResponse {
  totalDrivers: number;
  availableDrivers: number;
  onlineDrivers: number;
  busyDrivers: number;
  onDeliveryDrivers: number;
  offlineDrivers: number;
  onBreakDrivers: number;
  suspendedDrivers: number;
  pendingVerification: number;
  verifiedDrivers: number;
  rejectedDrivers: number;
}

export interface DriverResponse {
  id: number;
  
  // User info
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  // Personal
  profilePictureUrl?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // Vehicle
  vehicleType: VehicleType;
  vehicleNumber: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleYear?: number;
  vehicleCapacityKg?: number;

  // Operational
  status: DriverStatus;
  currentLatitude?: number;
  currentLongitude?: number;
  locationUpdatedAt?: string;

  // Performance
  rating?: number;
  totalRatings: number;
  totalTrips: number;
  totalDeliveries: number;
  acceptanceRate?: number;
  completionRate?: number;
  onTimeRate?: number;
  performanceScore?: number;

  // Capacity
  maxConcurrentOrders: number;
  activeOrderCount: number;

  // Tier
  tier: DriverTier;

  // Financial
  totalEarnings: number;
  walletBalance: number;

  // Zone
  preferredZone?: string;
  serviceRadiusKm?: number;

  // Verification
  verificationStatus: VerificationStatus;
  rejectionReason?: string;

  // Skills
  skillTags: DriverSkillTag[];

  // License
  licenseNumber?: string;
  licenseExpiry?: string;

  // Metadata
  active: boolean;
  onboardedAt?: string;
  lastActiveAt?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
