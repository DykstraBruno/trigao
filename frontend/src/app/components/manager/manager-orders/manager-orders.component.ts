import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Order, OrderStatus } from '../../../models/order.model';
import { PageResponse } from '../../../models/product.model';

@Component({
  selector: 'app-manager-orders',
  templateUrl: './manager-orders.component.html',
  styleUrls: ['./manager-orders.component.scss']
})
export class ManagerOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  storeName = '';
  filter: OrderStatus | '' = '';
  totalElements = 0;
  page = 0;
  size = 20;
  expandedId: number | null = null;
  pollSub?: Subscription;

  statusOptions: OrderStatus[] = ['PENDING', 'PAID', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
  nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    PAID:      'PREPARING',
    PREPARING: 'READY',
    READY:     'DELIVERED'
  };
  statusLabels: Record<string, string> = {
    PENDING:   'Aguardando pagamento',
    PAID:      'Pago — fazer',
    PREPARING: 'Preparando',
    READY:     'Pronto p/ entrega',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
  };

  constructor(
    private orderService: OrderService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.storeName = this.auth.currentUser?.storeName || '';
    this.load();
    this.pollSub = interval(15000).pipe(
      switchMap(() => this.orderService.getManagerOrders(this.page, this.size, this.filter || undefined))
    ).subscribe(res => this.applyPage(res));
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.orderService.getManagerOrders(this.page, this.size, this.filter || undefined).subscribe({
      next: res => { this.applyPage(res); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  setFilter(s: OrderStatus | ''): void {
    this.filter = s;
    this.page = 0;
    this.load();
  }

  advance(order: Order): void {
    const next = this.nextStatus[order.status];
    if (!next) return;
    this.orderService.managerUpdateStatus(order.id, next).subscribe(() => {
      order.status = next;
    });
  }

  cancel(order: Order): void {
    if (!confirm(`Cancelar pedido #${order.id}?`)) return;
    this.orderService.managerUpdateStatus(order.id, 'CANCELLED').subscribe(() => {
      order.status = 'CANCELLED';
    });
  }

  toggle(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  trackById(_: number, o: Order): number { return o.id; }

  private applyPage(res: PageResponse<Order>): void {
    this.orders = res.content;
    this.totalElements = res.totalElements;
  }
}
