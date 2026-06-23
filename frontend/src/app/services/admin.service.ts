import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SalesReport } from '../models/sales.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getSalesReport(historyDays = 30, forecastDays = 7, storeId?: number): Observable<SalesReport> {
    let params = new HttpParams()
      .set('historyDays', String(historyDays))
      .set('forecastDays', String(forecastDays));
    if (storeId) params = params.set('storeId', String(storeId));
    return this.http.get<SalesReport>(`${this.base}/analytics/sales`, { params });
  }

  downloadSalesCsv(from: string, to: string, storeId?: number): Observable<Blob> {
    let params = new HttpParams().set('from', from).set('to', to);
    if (storeId) params = params.set('storeId', String(storeId));
    return this.http.get(`${this.base}/reports/sales.csv`, { params, responseType: 'blob' });
  }

  fetchSalesHtml(from: string, to: string, storeId?: number): Observable<Blob> {
    let params = new HttpParams().set('from', from).set('to', to);
    if (storeId) params = params.set('storeId', String(storeId));
    return this.http.get(`${this.base}/reports/sales.html`, { params, responseType: 'blob' });
  }
}
