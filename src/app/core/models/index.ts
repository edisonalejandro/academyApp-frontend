// ========================================
// ENUMERACIONES
// ========================================

export enum StudentCategory {
  REGULAR = 'REGULAR',
  UNIVERSITY = 'UNIVERSITY',
  COUPLE = 'COUPLE',
  SENIOR = 'SENIOR',
  CHILD = 'CHILD'
}

export enum PricingType {
  SINGLE_CLASS = 'SINGLE_CLASS',
  PACKAGE_4 = 'PACKAGE_4',
  PACKAGE_8 = 'PACKAGE_8',
  PACKAGE_12 = 'PACKAGE_12',
  COUPLE_PACKAGE_8 = 'COUPLE_PACKAGE_8',
  UNLIMITED_MONTHLY = 'UNLIMITED_MONTHLY'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum DanceType {
  SALSA = 'SALSA',
  BACHATA = 'BACHATA',
  MERENGUE = 'MERENGUE',
  REGGAETON = 'REGGAETON',
  CUMBIA = 'CUMBIA',
  TANGO = 'TANGO',
  KIZOMBA = 'KIZOMBA',
  ZOUK = 'ZOUK',
  MAMBO = 'MAMBO',
  CHA_CHA_CHA = 'CHA_CHA_CHA'
}

export enum DanceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  MASTER = 'MASTER',
  OPEN = 'OPEN'
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED',
  TRANSFERRED = 'TRANSFERRED',
  HOURS_EXHAUSTED = 'HOURS_EXHAUSTED'
}

// ========================================
// AUTENTICACIÓN
// ========================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface LogoutResponse {
  message: string;
}

// ========================================
// USUARIOS
// ========================================

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // write-only
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: string[]; // read-only
}

// ========================================
// PRECIOS
// ========================================

export interface PricingCalculationRequest {
  courseId: number;
  studentCategory: StudentCategory;
  personCount?: number;
}

export interface PricingOptionDTO {
  pricingRuleId: number;
  name: string;
  description: string;
  pricingType: PricingType;
  classQuantity: number;
  originalPrice: number;
  finalPrice: number;
  discountPercentage: number;
  savings: number;
  pricePerClass: number;
  isRecommended: boolean;
  validFrom: string;
  validUntil: string;
}

export interface PricingCalculationDTO {
  courseId: number;
  courseName: string;
  studentCategory: StudentCategory;
  personCount: number;
  isCouple: boolean;
  options: PricingOptionDTO[];
  recommendedOptionId: number;
  calculatedAt: string;
  hasDefaultPricing: boolean;
}

export interface PricingRuleDTO {
  id: number;
  name: string;
  description: string;
  pricingType: PricingType;
  studentCategory: StudentCategory;
  personCount: number;
  classQuantity: number;
  price: number;
  discountPercentage: number;
  finalPrice: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuickQuoteRequest {
  studentCategory: StudentCategory;
  personCount?: number;
}

// ========================================
// PAGOS
// ========================================

export interface PaymentRequestDTO {
  courseId: number;
  pricingRuleId: number;
  studentCategory: StudentCategory;
  paymentMethod: PaymentMethod;
  personCount: number;
  notes?: string;
  transactionId?: string;
}

export interface PaymentValidationResponse {
  valid: boolean;
  price?: number;
  currency?: string;
  message: string;
}

export interface PaymentResponseDTO {
  id: number;
  paymentCode: string;
  studentName: string;
  courseName: string;
  pricingType: PricingType;
  studentCategory: StudentCategory;
  quantityClasses: number;
  personCount: number;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  pricePerClass: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate: string;
  createdAt: string;
  notes?: string;
}

export interface FlexiblePriceResponse {
  price: number;
  currency: string;
  numberOfClasses: number;
  studentCategory: StudentCategory;
  isCouple: boolean;
  pricePerClass: number;
}

export interface PriceByRuleResponse {
  price: number;
  currency: string;
  pricingRuleId: number;
}

// ========================================
// UTILIDADES
// ========================================

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
