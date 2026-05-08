// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, LoginRequest, LoginResponse } from '../models/admin.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'trigao_auth_token';
  private userKey = 'trigao_user';

  constructor(private router: Router) {
    // Carregar usuário do localStorage ao iniciar
    this.loadUserFromStorage();
  }

  // Login (mock - substituir por chamada real à API)
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // TODO: Substituir por chamada HTTP real
    // return this.http.post<LoginResponse>('/api/auth/login', credentials);

    // Mock para desenvolvimento
    if (credentials.email === 'admin@trigao.com' && credentials.password === 'admin123') {
      const response: LoginResponse = {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          name: 'Administrador Trigão',
          role: 'admin',
          storeId: 1
        }
      };

      this.setSession(response);
      return of(response);
    }

    throw new Error('Credenciais inválidas');
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Verificar se é admin
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Salvar sessão
  private setSession(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  // Carregar do storage
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.userKey);
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      }
    }
  }
}
