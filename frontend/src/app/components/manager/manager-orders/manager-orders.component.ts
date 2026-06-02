import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { RealtimeService, OrderEvent } from '../../../services/realtime.service';
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
  storeId: number | null = null;
  filter: OrderStatus | '' = '';
  totalElements = 0;
  page = 0;
  size = 50;
  expandedId: number | null = null;
  realtimeConnected = false;

  private wsSub?: Subscription;
  private connSub?: Subscription;

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
    private auth: AuthService,
    private realtime: RealtimeService
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    this.storeName = user?.storeName || '';
    this.storeId = user?.storeId ?? null;

    this.load();

    if (this.storeId != null) {
      this.connSub = this.realtime.isConnected$().subscribe(c => this.realtimeConnected = c);
      this.wsSub = this.realtime.storeOrders$(this.storeId).subscribe(ev => this.onEvent(ev));
    }
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
    this.connSub?.unsubscribe();
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
    this.orderService.managerUpdateStatus(order.id, next).subscribe(updated => {
      this.upsert(updated);
    });
  }

  cancel(order: Order): void {
    if (!confirm(`Cancelar pedido #${order.id}?`)) return;
    this.orderService.managerUpdateStatus(order.id, 'CANCELLED').subscribe(updated => {
      this.upsert(updated);
    });
  }

  toggle(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  trackById(_: number, o: Order): number { return o.id; }

  private onEvent(ev: OrderEvent): void {
    const isNew = !this.orders.some(o => o.id === ev.order.id);
    this.upsert(ev.order);
    if (ev.type === 'CREATED' && isNew) {
      this.notifyNewOrder(ev.order);
    }
  }

  private upsert(order: Order): void {
    const idx = this.orders.findIndex(o => o.id === order.id);
    // Respeita filtro atual
    if (this.filter && order.status !== this.filter) {
      if (idx >= 0) {
        this.orders.splice(idx, 1);
        this.totalElements--;
      }
      return;
    }
    if (idx >= 0) {
      this.orders[idx] = order;
    } else {
      this.orders = [order, ...this.orders];
      this.totalElements++;
    }
  }

  private notifyNewOrder(order: Order): void {
    this.playBeep();
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Novo pedido #${order.id}`, {
        body: `${order.customerName || 'Cliente'} — R$ ${order.totalAmount.toFixed(2)}`
      });
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  private playBeep(): void {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
      osc.onended = () => ctx.close();
    } catch { /* silent */ }
  }

  private applyPage(res: PageResponse<Order>): void {
    this.orders = res.content;
    this.totalElements = res.totalElements;
  }
}
