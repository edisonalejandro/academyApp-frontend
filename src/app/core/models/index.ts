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

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  GRADUATED = 'GRADUATED',
  DROPPED_OUT = 'DROPPED_OUT',
  ON_HOLD = 'ON_HOLD'
}

export enum ClassStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
  NO_SHOW = 'NO_SHOW'
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
// CURSOS
// ========================================

export interface CourseDTO {
  id: number;
  title: string;
  code: string;
  description: string;
  danceType: DanceType;
  level: DanceLevel;
  pricePerHour: number;
  durationHours: number;
  maxCapacity: number;
  teacherId: number;
  teacherName?: string;
  teacherEmail?: string;
  isActive: boolean;
  imageUrl?: string;
  prerequisites?: string;
  objectives?: string;
  activeEnrollments?: number;
  availableSlots?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCapacityResponse {
  courseId: number;
  courseTitle: string;
  maxCapacity: number;
  activeEnrollments: number;
  availableSlots: number;
}

export interface CreateCourseDTO {
  title: string;
  code: string;
  description: string;
  danceType: DanceType;
  level: DanceLevel;
  pricePerHour: number;
  durationHours: number;
  maxCapacity: number;
  teacherId: number;
  imageUrl?: string;
  prerequisites?: string;
  objectives?: string;
}

export interface UpdateCourseDTO {
  title?: string;
  code?: string;
  description?: string;
  danceType?: DanceType;
  level?: DanceLevel;
  pricePerHour?: number;
  durationHours?: number;
  maxCapacity?: number;
  teacherId?: number;
  imageUrl?: string;
  prerequisites?: string;
  objectives?: string;
}

// ========================================
// ESTUDIANTES
// ========================================

export interface StudentDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  dateOfBirth?: string;
  address?: string;
  category: StudentCategory;
  status: StudentStatus;
  universityName?: string;
  studentId?: string;
  career?: string;
  semester?: number;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
  danceExperience?: string;
  fitnessLevel?: string;
  physicalLimitations?: string;
  preferredContactMethod?: string;
  newsletterSubscription?: boolean;
  promotionalEmails?: boolean;
  notes?: string;
  userId?: number;
  userEmail?: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentCategoryUpdateRequest {
  category: StudentCategory;
}

// ========================================
// INSCRIPCIONES
// ========================================

export interface EnrollmentDTO {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  paymentId: number;
  paymentCode: string;
  status: EnrollmentStatus;
  enrollmentDate: string;
  startDate?: string;
  endDate?: string;
  purchasedHours: number;
  usedHours: number;
  remainingHours: number;
  totalPaid: number;
  paidAmount: number;
  discountPercentage: number;
  finalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentSummaryResponse {
  totalEnrollments: number;
  activeEnrollments: number;
  totalHoursPurchased: number;
  totalHoursUsed: number;
  totalHoursRemaining: number;
  totalAmountPaid: number;
}

export interface EnrollmentCancelRequest {
  reason?: string;
}

// ========================================
// SESIONES DE CLASE
// ========================================

export interface ClassSessionDTO {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  teacherId: number;
  teacherName: string;
  teacherEmail: string;
  sessionName: string;
  description?: string;
  scheduledDate: string;
  actualStartTime?: string;
  actualEndTime?: string;
  plannedDuration: number;
  actualDuration?: number;
  status: ClassStatus;
  maxCapacity: number;
  location: string;
  topic?: string;
  requiredMaterials?: string;
  teacherNotes?: string;
  virtualMeetingUrl?: string;
  isVirtual: boolean;
  isRecurring: boolean;
  parentClassId?: number;
  difficultyLevel?: string;
  specialRequirements?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  attendanceCount?: number;
  availableSpots?: number;
}

export interface ClassSessionCancelRequest {
  reason?: string;
}

// ========================================
// ASISTENCIAS
// ========================================

export interface AttendanceDTO {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  classSessionId: number;
  sessionName: string;
  scheduledDate: string;
  courseId: number;
  courseName: string;
  attended: boolean;
  isLate?: boolean;
  isExcused?: boolean;
  attendanceDate?: string;
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
  recordedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceCreateRequest {
  studentId: number;
  classSessionId: number;
  attended: boolean;
  notes?: string;
}

export interface AttendanceUpdateRequest {
  attended: boolean;
  notes?: string;
}

export interface AttendanceRateResponse {
  studentId: number;
  attendanceRate: number;
}

export interface AttendanceCheckResponse {
  hasRecord: boolean;
}

export interface AttendanceReportResponse {
  reportDate: string;
  periodStart: string;
  periodEnd: string;
  totalClasses: number;
  totalAttendances: number;
  totalAbsences: number;
  overallAttendanceRate: number;
  courseStats: AttendanceCourseStats[];
  studentStats: AttendanceStudentStats[];
  lowAttendanceStudents: any[];
  topAttendanceStudents: any[];
}

export interface AttendanceCourseStats {
  courseId: number;
  courseName: string;
  totalSessions: number;
  totalAttendances: number;
  totalAbsences: number;
  attendanceRate: number;
}

export interface AttendanceStudentStats {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  totalClasses: number;
  classesAttended: number;
  classesMissed: number;
  attendanceRate: number;
  riskLevel: string;
}

export interface LowAttendanceStudent {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  attendanceRate: number;
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
