import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, PageResponse } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(page = 0, size = 12, categoryId?: number, search?: string): Observable<PageResponse<Product>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (categoryId) params = params.set('categoryId', String(categoryId));
    if (search)     params = params.set('search', search);
    return this.http.get<PageResponse<Product>>(this.base, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  // Admin
  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.base, product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private base = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }

  create(cat: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.base, cat);
  }

  update(id: number, cat: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.base}/${id}`, cat);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
