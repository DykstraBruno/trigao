import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoyaltyBalance, LoyaltyHistoryPage } from '../models/loyalty.model';

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  private base = `${environment.apiUrl}/loyalty`;

  constructor(private http: HttpClient) {}

  balance(): Observable<LoyaltyBalance> {
    return this.http.get<LoyaltyBalance>(`${this.base}/balance`);
  }

  history(page = 0, size = 50): Observable<LoyaltyHistoryPage> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<LoyaltyHistoryPage>(`${this.base}/history`, { params });
  }
}
