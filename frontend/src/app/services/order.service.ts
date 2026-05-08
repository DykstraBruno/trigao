import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, CreateOrderRequest } from '../models/order.model';
import { PageResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  create(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.base, request);
  }

  getMyOrders(page = 0, size = 10): Observable<PageResponse<Order>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<PageResponse<Order>>(this.base, { params });
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  // Admin
  getAllOrders(page = 0, size = 20): Observable<PageResponse<Order>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<PageResponse<Order>>(`${this.base}/admin/all`, { params });
  }

  updateStatus(id: number, status: string): Observable<Order> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Order>(`${this.base}/admin/${id}/status`, {}, { params });
  }
}
