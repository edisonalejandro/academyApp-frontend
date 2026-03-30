import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartDTO, AddToCartRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly base = `${environment.apiUrl}/catalog/cart`;

  private _cart = signal<CartDTO>({ items: [], totalItems: 0, subtotal: 0 });

  readonly cart = this._cart.asReadonly();
  readonly totalItems = computed(() => this._cart().totalItems);
  readonly subtotal = computed(() => this._cart().subtotal);

  constructor(private http: HttpClient) {}

  loadCart(): Observable<CartDTO> {
    return this.http.get<CartDTO>(this.base).pipe(
      tap(cart => this._cart.set(cart))
    );
  }

  addItem(request: AddToCartRequest): Observable<CartDTO> {
    return this.http.post<CartDTO>(`${this.base}/items`, request).pipe(
      tap(cart => this._cart.set(cart))
    );
  }

  updateQuantity(variantId: number, quantity: number): Observable<CartDTO> {
    return this.http.put<CartDTO>(`${this.base}/items/${variantId}`, { quantity }).pipe(
      tap(cart => this._cart.set(cart))
    );
  }

  removeItem(variantId: number): Observable<CartDTO> {
    return this.http.delete<CartDTO>(`${this.base}/items/${variantId}`).pipe(
      tap(cart => this._cart.set(cart))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.base).pipe(
      tap(() => this._cart.set({ items: [], totalItems: 0, subtotal: 0 }))
    );
  }

  clearLocal(): void {
    this._cart.set({ items: [], totalItems: 0, subtotal: 0 });
  }
}
