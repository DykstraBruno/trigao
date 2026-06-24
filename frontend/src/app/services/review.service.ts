import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Review,
  ReviewSummary,
  ReviewableItem,
  CreateReviewRequest
} from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.base}/products/${productId}/reviews`);
  }

  summary(productId: number): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${this.base}/products/${productId}/reviews/summary`);
  }

  create(req: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.base}/reviews`, req);
  }

  reviewable(): Observable<ReviewableItem[]> {
    return this.http.get<ReviewableItem[]>(`${this.base}/reviews/reviewable`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/reviews/${id}`);
  }
}
