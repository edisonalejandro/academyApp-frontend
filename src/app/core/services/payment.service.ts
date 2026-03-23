import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PaymentRequestDTO,
  PaymentResponseDTO,
  PaymentValidationResponse,
  FlexiblePriceResponse,
  PriceByRuleResponse,
  StudentCategory,
  PricingCalculationDTO
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly baseUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/payments/pricing/calculate - Alias del endpoint de precios
   * Sin autenticación requerida
   */
  calculatePricing(
    courseId: number,
    studentCategory: StudentCategory,
    personCount: number = 1
  ): Observable<PricingCalculationDTO> {
    const params = new HttpParams()
      .set('courseId', courseId.toString())
      .set('studentCategory', studentCategory)
      .set('personCount', personCount.toString());
    
    return this.http.get<PricingCalculationDTO>(`${this.baseUrl}/pricing/calculate`, { params });
  }

  /**
   * GET /api/payments/pricing/flexible - Cálculo rápido por número de clases
   * Sin autenticación requerida
   */
  getFlexiblePrice(
    numberOfClasses: number,
    studentCategory: StudentCategory,
    isCouple: boolean = false
  ): Observable<FlexiblePriceResponse> {
    const params = new HttpParams()
      .set('numberOfClasses', numberOfClasses.toString())
      .set('studentCategory', studentCategory)
      .set('isCouple', isCouple.toString());
    
    return this.http.get<FlexiblePriceResponse>(`${this.baseUrl}/pricing/flexible`, { params });
  }

  /**
   * GET /api/payments/pricing/rule/{pricingRuleId} - Precio de regla específica
   * Sin autenticación requerida
   */
  getPriceByRule(pricingRuleId: number): Observable<PriceByRuleResponse> {
    return this.http.get<PriceByRuleResponse>(`${this.baseUrl}/pricing/rule/${pricingRuleId}`);
  }

  /**
   * POST /api/payments/validate - Validar datos de pago antes de procesar
   * Sin autenticación requerida (o usuario autenticado)
   */
  validatePayment(request: PaymentRequestDTO): Observable<PaymentValidationResponse> {
    return this.http.post<PaymentValidationResponse>(`${this.baseUrl}/validate`, request);
  }

  /**
   * POST /api/payments/process - Procesar pago y generar inscripción
   * Requiere autenticación: STUDENT o ADMIN
   */
  processPayment(request: PaymentRequestDTO): Observable<PaymentResponseDTO> {
    return this.http.post<PaymentResponseDTO>(`${this.baseUrl}/process`, request);
  }

  /**
   * GET /api/payments/status/{paymentCode} - Consultar pago por código
   * Requiere autenticación
   */
  getPaymentStatus(paymentCode: string): Observable<PaymentResponseDTO> {
    return this.http.get<PaymentResponseDTO>(`${this.baseUrl}/status/${paymentCode}`);
  }

  /**
   * GET /api/payments/my-payments - Historial de pagos del usuario
   * Requiere autenticación: STUDENT, TEACHER, ADMIN
   */
  getMyPayments(): Observable<PaymentResponseDTO[]> {
    return this.http.get<PaymentResponseDTO[]>(`${this.baseUrl}/my-payments`);
  }
}
