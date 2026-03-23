// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  USER = 'USER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum PricingRuleCategory {
  STANDARD = 'STANDARD',
  DISCOUNT = 'DISCOUNT',
  PROMOTION = 'PROMOTION',
  SPECIAL = 'SPECIAL'
}

// Interfaces principales
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: UserStatus;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Payment models
export interface PaymentRequest {
  courseId: number;
  studentId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  description?: string;
}

export interface Payment {
  id: number;
  code: string;
  courseId: number;
  studentId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  description?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentValidation {
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface PaymentStatusResponse {
  code: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  processedAt?: Date;
}

// Pricing models
export interface PricingCalculateRequest {
  courseId?: number;
  duration?: number;
  studentType?: string;
  promotionCode?: string;
}

export interface PricingOption {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  finalPrice: number;
  discount: number;
  discountPercentage: number;
  currency: string;
  validUntil?: Date;
}

export interface PricingCalculateResponse {
  options: PricingOption[];
  bestOption: PricingOption;
  currency: string;
  calculatedAt: Date;
}

export interface PricingRule {
  id: number;
  name: string;
  description: string;
  category: PricingRuleCategory;
  discountPercentage: number;
  fixedDiscount: number;
  minAmount?: number;
  maxAmount?: number;
  validFrom: Date;
  validTo?: Date;
  isActive: boolean;
  priority: number;
  conditions: any; // JSON object with rule conditions
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface ApiError {
  message: string;
  error: string;
  status: number;
  timestamp: Date;
  path: string;
}

// Search and pagination
export interface SearchCriteria {
  query?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Role management
export interface RoleAssignRequest {
  userId: number;
  role: UserRole;
}

export interface RoleRemoveRequest {
  userId: number;
  role: UserRole;
}

export interface UserRoleDistribution {
  role: UserRole;
  count: number;
  percentage: number;
}

// Reports
export interface RevenueReport {
  period: string;
  totalRevenue: number;
  currency: string;
  transactionCount: number;
  averageTransaction: number;
  breakdown: RevenueBreakdown[];
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface PaymentStats {
  totalPayments: number;
  totalRevenue: number;
  currency: string;
  successRate: number;
  averageAmount: number;
  topPaymentMethods: PaymentMethodStats[];
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  totalAmount: number;
  percentage: number;
}