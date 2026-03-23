import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PricingCalculationRequest,
  PricingCalculationDTO,
  PricingRuleDTO,
  QuickQuoteRequest,
  StudentCategory,
  PricingType
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private readonly baseUrl = `${environment.apiUrl}/pricing`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/pricing/calculate - Calcular precios disponibles
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
    
    return this.http.get<PricingCalculationDTO>(`${this.baseUrl}/calculate`, { params });
  }

  /**
   * POST /api/pricing/calculate - Calcular precios (método POST)
   * Sin autenticación requerida
   */
  calculatePricingPost(request: PricingCalculationRequest): Observable<PricingCalculationDTO> {
    return this.http.post<PricingCalculationDTO>(`${this.baseUrl}/calculate`, request);
  }

  /**
   * GET /api/pricing/quick-quote - Cotización rápida sin curso específico
   * Sin autenticación requerida
   */
  getQuickQuote(
    studentCategory: StudentCategory,
    personCount: number = 1
  ): Observable<PricingCalculationDTO> {
    const params = new HttpParams()
      .set('studentCategory', studentCategory)
      .set('personCount', personCount.toString());
    
    return this.http.get<PricingCalculationDTO>(`${this.baseUrl}/quick-quote`, { params });
  }

  /**
   * GET /api/pricing/rules - Listar todas las reglas de precios
   * Sin autenticación requerida
   */
  getPricingRules(
    studentCategory?: StudentCategory,
    pricingType?: PricingType,
    activeOnly: boolean = true
  ): Observable<PricingRuleDTO[]> {
    let params = new HttpParams().set('activeOnly', activeOnly.toString());
    
    if (studentCategory) {
      params = params.set('studentCategory', studentCategory);
    }
    
    if (pricingType) {
      params = params.set('pricingType', pricingType);
    }
    
    return this.http.get<PricingRuleDTO[]>(`${this.baseUrl}/rules`, { params });
  }

  /**
   * GET /api/pricing/rules/{ruleId} - Obtener regla específica
   * Sin autenticación requerida
   */
  getPricingRuleById(ruleId: number): Observable<PricingRuleDTO> {
    return this.http.get<PricingRuleDTO>(`${this.baseUrl}/rules/${ruleId}`);
  }

  /**
   * GET /api/pricing/rules/available - Reglas disponibles para curso/categoría
   * Sin autenticación requerida
   */
  getAvailableRules(
    courseId: number,
    studentCategory: StudentCategory,
    personCount: number = 1
  ): Observable<PricingRuleDTO[]> {
    const params = new HttpParams()
      .set('courseId', courseId.toString())
      .set('studentCategory', studentCategory)
      .set('personCount', personCount.toString());
    
    return this.http.get<PricingRuleDTO[]>(`${this.baseUrl}/rules/available`, { params });
  }

  /**
   * GET /api/pricing/rules/category/{category} - Reglas por categoría
   * Sin autenticación requerida
   */
  getRulesByCategory(
    category: StudentCategory,
    personCount?: number
  ): Observable<PricingRuleDTO[]> {
    let params = new HttpParams();
    
    if (personCount) {
      params = params.set('personCount', personCount.toString());
    }
    
    return this.http.get<PricingRuleDTO[]>(`${this.baseUrl}/rules/category/${category}`, { params });
  }
}
