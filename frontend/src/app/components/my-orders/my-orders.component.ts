import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { PageResponse } from '../../models/product.model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  statusLabels: Record<string, string> = {
    PENDING: 'Aguardando Pagamento',
    PAID: 'Pago',
    PREPARING: 'Preparando',
    READY: 'Pronto',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
  };

  statusClasses: Record<string, string> = {
    PENDING: 'badge-warning',
    PAID: 'badge-info',
    PREPARING: 'badge-primary',
    READY: 'badge-success',
    DELIVERED: 'badge-success',
    CANCELLED: 'badge-error'
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (page: PageResponse<Order>) => { this.orders = page.content; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
