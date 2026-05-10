export type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  storeId?: number;
  storeName?: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
  storeId?: number;
  storeName?: string;
}
