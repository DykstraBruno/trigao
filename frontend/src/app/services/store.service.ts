import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Store, Manager, CreateManagerRequest } from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private base = `${environment.apiUrl}/stores`;
  private adminBase = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  list(includeInactive = false): Observable<Store[]> {
    const params = new HttpParams().set('includeInactive', String(includeInactive));
    return this.http.get<Store[]>(this.base, { params });
  }

  getById(id: number): Observable<Store> {
    return this.http.get<Store>(`${this.base}/${id}`);
  }

  create(store: Partial<Store>): Observable<Store> {
    return this.http.post<Store>(this.base, store);
  }

  update(id: number, store: Partial<Store>): Observable<Store> {
    return this.http.put<Store>(`${this.base}/${id}`, store);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // Managers
  listManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.adminBase}/managers`);
  }

  createManager(request: CreateManagerRequest): Observable<Manager> {
    return this.http.post<Manager>(`${this.adminBase}/managers`, request);
  }

  reassignManager(id: number, storeId: number): Observable<Manager> {
    return this.http.patch<Manager>(`${this.adminBase}/managers/${id}/store/${storeId}`, {});
  }

  deleteManager(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminBase}/managers/${id}`);
  }
}
