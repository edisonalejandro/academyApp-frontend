import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductCategoryDTO, ProductDTO, ProductVariantDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly base = `${environment.apiUrl}/catalog`;

  constructor(private http: HttpClient) {}

  // ===== CATEGORÍAS =====

  getCategories(): Observable<ProductCategoryDTO[]> {
    return this.http.get<ProductCategoryDTO[]>(`${this.base}/categories`);
  }

  getAllCategories(): Observable<ProductCategoryDTO[]> {
    return this.http.get<ProductCategoryDTO[]>(`${this.base}/categories/all`);
  }

  // ===== PRODUCTOS =====

  getProducts(params?: { categorySlug?: string; q?: string; featured?: boolean }): Observable<ProductDTO[]> {
    let httpParams = new HttpParams();
    if (params?.categorySlug) httpParams = httpParams.set('categorySlug', params.categorySlug);
    if (params?.q) httpParams = httpParams.set('q', params.q);
    if (params?.featured) httpParams = httpParams.set('featured', 'true');
    return this.http.get<ProductDTO[]>(`${this.base}/products`, { params: httpParams });
  }

  getFeaturedProducts(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.base}/products`, {
      params: new HttpParams().set('featured', 'true')
    });
  }

  getProductById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.base}/products/${id}`);
  }

  getProductBySlug(slug: string): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.base}/products/slug/${slug}`);
  }

  // ===== ADMIN — PRODUCTOS =====

  updateProduct(id: number, dto: Partial<ProductDTO>): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.base}/products/${id}`, dto);
  }

  uploadProductImage(id: number, file: File): Observable<{ imageUrl: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.base}/products/${id}/image`, form);
  }

  // ===== ADMIN — VARIANTES =====

  addVariant(productId: number, dto: Partial<ProductVariantDTO>): Observable<ProductVariantDTO> {
    return this.http.post<ProductVariantDTO>(`${this.base}/products/${productId}/variants`, dto);
  }

  updateVariant(productId: number, variantId: number, dto: Partial<ProductVariantDTO>): Observable<ProductVariantDTO> {
    return this.http.put<ProductVariantDTO>(`${this.base}/products/${productId}/variants/${variantId}`, dto);
  }

  deleteVariant(productId: number, variantId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/products/${productId}/variants/${variantId}`);
  }
}

