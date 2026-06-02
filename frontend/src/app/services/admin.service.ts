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
}
