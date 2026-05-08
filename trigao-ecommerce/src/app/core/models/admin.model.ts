// src/app/core/models/admin.model.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  storeId?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SalesStats {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  averageTicket: number;
  taxSavings: number; // Economia vs iFood
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'pix' | 'credit_card' | 'debit_card';
  createdAt: Date;
  storeId: number;
  storeName: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'pending'       // Aguardando pagamento
  | 'paid'          // Pago
  | 'preparing'     // Em preparação
  | 'ready'         // Pronto para retirada/entrega
  | 'delivering'    // Saiu para entrega
  | 'delivered'     // Entregue
  | 'cancelled';    // Cancelado

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  storeId: number;
}

export interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}
