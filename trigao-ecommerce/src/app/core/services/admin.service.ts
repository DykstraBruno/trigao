// src/app/core/services/admin.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  SalesStats, 
  TopProduct, 
  Order, 
  StockAlert, 
  SalesChartData 
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor() {}

  // Obter estatísticas de vendas
  getSalesStats(): Observable<SalesStats> {
    // TODO: Substituir por chamada HTTP real
    // return this.http.get<SalesStats>('/api/admin/stats');

    // Mock para desenvolvimento
    const stats: SalesStats = {
      todayRevenue: 1247.50,
      weekRevenue: 8543.20,
      monthRevenue: 35678.90,
      todayOrders: 37,
      weekOrders: 245,
      monthOrders: 1023,
      averageTicket: 34.87,
      taxSavings: 2456.78 // 7% de economia vs iFood (35678.90 * 0.07)
    };

    return of(stats);
  }

  // Obter produtos mais vendidos
  getTopProducts(limit: number = 5): Observable<TopProduct[]> {
    // TODO: Substituir por chamada HTTP real
    
    const topProducts: TopProduct[] = [
      {
        productId: 'prod-001',
        productName: 'Pão Francês',
        totalSold: 245,
        revenue: 183.75,
        imageUrl: 'assets/products/pao-frances.jpg'
      },
      {
        productId: 'prod-002',
        productName: 'Croissant Artesanal',
        totalSold: 89,
        revenue: 756.50,
        imageUrl: 'assets/products/croissant.jpg'
      },
      {
        productId: 'prod-007',
        productName: 'Bolo Nega Maluca',
        totalSold: 12,
        revenue: 504.00,
        imageUrl: 'assets/products/nega-maluca.jpg'
      },
      {
        productId: 'prod-008',
        productName: 'Coxinha Grande',
        totalSold: 156,
        revenue: 1170.00,
        imageUrl: 'assets/products/coxinha.jpg'
      },
      {
        productId: 'prod-006',
        productName: 'Pão de Forma Integral',
        totalSold: 45,
        revenue: 540.00,
        imageUrl: 'assets/products/pao-forma.jpg'
      }
    ];

    return of(topProducts.slice(0, limit));
  }

  // Obter pedidos recentes
  getRecentOrders(limit: number = 10): Observable<Order[]> {
    // TODO: Substituir por chamada HTTP real

    const orders: Order[] = [
      {
        id: 'ORD-001',
        customerName: 'Maria Silva',
        items: [
          { productId: 'prod-001', productName: 'Pão Francês', quantity: 10, price: 0.75 },
          { productId: 'prod-002', productName: 'Croissant', quantity: 2, price: 8.50 }
        ],
        total: 24.50,
        status: 'preparing',
        paymentMethod: 'pix',
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min atrás
        storeId: 1,
        storeName: 'Barão de Gurguéia'
      },
      {
        id: 'ORD-002',
        customerName: 'João Santos',
        items: [
          { productId: 'prod-007', productName: 'Bolo Nega Maluca', quantity: 1, price: 42.00 }
        ],
        total: 42.00,
        status: 'ready',
        paymentMethod: 'credit_card',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
        storeId: 2,
        storeName: 'Joaquim Ribeiro'
      },
      {
        id: 'ORD-003',
        customerName: 'Ana Costa',
        items: [
          { productId: 'prod-008', productName: 'Coxinha Grande', quantity: 4, price: 7.50 },
          { productId: 'prod-009', productName: 'Café Expresso', quantity: 2, price: 5.00 }
        ],
        total: 40.00,
        status: 'delivering',
        paymentMethod: 'pix',
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 min atrás
        storeId: 1,
        storeName: 'Barão de Gurguéia'
      }
    ];

    return of(orders.slice(0, limit));
  }

  // Obter alertas de estoque
  getStockAlerts(): Observable<StockAlert[]> {
    // TODO: Substituir por chamada HTTP real

    const alerts: StockAlert[] = [
      {
        productId: 'prod-006',
        productName: 'Pão de Forma Integral',
        currentStock: 8,
        minStock: 15,
        storeId: 2
      },
      {
        productId: 'prod-001',
        productName: 'Pão Francês',
        currentStock: 25,
        minStock: 50,
        storeId: 3
      }
    ];

    return of(alerts);
  }

  // Obter dados do gráfico de vendas
  getSalesChartData(period: 'week' | 'month'): Observable<SalesChartData[]> {
    // TODO: Substituir por chamada HTTP real

    if (period === 'week') {
      // Últimos 7 dias
      const data: SalesChartData[] = [
        { date: 'Seg', revenue: 1234.50, orders: 42 },
        { date: 'Ter', revenue: 1456.20, orders: 48 },
        { date: 'Qua', revenue: 1123.80, orders: 38 },
        { date: 'Qui', revenue: 1678.40, orders: 55 },
        { date: 'Sex', revenue: 1890.30, orders: 62 },
        { date: 'Sáb', revenue: 2234.70, orders: 71 },
        { date: 'Dom', revenue: 1925.30, orders: 58 }
      ];
      return of(data);
    } else {
      // Últimos 30 dias (resumido por semana)
      const data: SalesChartData[] = [
        { date: 'Sem 1', revenue: 8543.20, orders: 245 },
        { date: 'Sem 2', revenue: 9234.50, orders: 278 },
        { date: 'Sem 3', revenue: 8901.30, orders: 261 },
        { date: 'Sem 4', revenue: 8999.90, orders: 269 }
      ];
      return of(data);
    }
  }

  // Atualizar status do pedido
  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    // TODO: Implementar chamada HTTP real
    console.log(`Atualizando pedido ${orderId} para status ${status}`);
    return of({} as Order);
  }
}
