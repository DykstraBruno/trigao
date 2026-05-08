import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order, OrderStatus } from '../../../models/order.model';
import { PageResponse } from '../../../models/product.model';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  statusOptions: OrderStatus[] = ['PENDING', 'PAID', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

  statusLabels: Record<string, string> = {
    PENDING:   'Aguardando',
    PAID:      'Pago',
    PREPARING: 'Preparando',
    READY:     'Pronto',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (page: PageResponse<Order>) => { this.orders = page.content; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  updateStatus(order: Order, status: OrderStatus): void {
    if (order.status === status) return;
    this.orderService.updateStatus(order.id, status).subscribe(() => {
      order.status = status;
    });
  }
}
