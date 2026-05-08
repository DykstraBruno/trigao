export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}
