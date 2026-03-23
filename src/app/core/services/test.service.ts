import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly baseUrl = `${environment.apiUrl}/test`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/test/hello - Health check simple
   * Sin autenticación requerida
   */
  hello(): Observable<string> {
    return this.http.get(`${this.baseUrl}/hello`, { responseType: 'text' as 'json' });
  }

  /**
   * GET /api/test/ping - Ping al servidor
   * Sin autenticación requerida
   */
  ping(): Observable<string> {
    return this.http.get(`${this.baseUrl}/ping`, { responseType: 'text' as 'json' });
  }
}
