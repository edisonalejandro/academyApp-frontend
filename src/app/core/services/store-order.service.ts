import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutRequest, StoreOrderDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class StoreOrderService {
  private readonly base = `${environment.apiUrl}/catalog/orders`;

  constructor(private http: HttpClient) {}

  checkout(request: CheckoutRequest): Observable<StoreOrderDTO> {
    return this.http.post<StoreOrderDTO>(`${this.base}/checkout`, request);
  }

  getMyOrders(): Observable<StoreOrderDTO[]> {
    return this.http.get<StoreOrderDTO[]>(`${this.base}/my-orders`);
  }

  getOrderByNumber(orderNumber: string): Observable<StoreOrderDTO> {
    return this.http.get<StoreOrderDTO>(`${this.base}/number/${orderNumber}`);
  }
}
