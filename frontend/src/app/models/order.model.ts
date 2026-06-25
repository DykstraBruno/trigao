export type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  billingUrl?: string;
  paymentMethod?: string;
  address?: string;
  createdAt: string;
  storeId?: number;
  storeName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  discountAmount?: number;
  loyaltyPointsUsed?: number;
  loyaltyPointsEarned?: number;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  storeId: number;
  notes?: string;
  address?: string;
  paymentMethod: string;
  pointsToRedeem?: number;
}
