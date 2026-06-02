import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Order, OrderStatus } from '../../models/order.model';
import { PageResponse } from '../../models/product.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

type StatusFilter = '' | OrderStatus;

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  filtered: Order[] = [];
  loading = true;
  filter: StatusFilter = '';
  expandedId: number | null = null;

  // Etapas do happy path (CANCELLED é tratado fora)
  steps: OrderStatus[] = ['PENDING', 'PAID', 'PREPARING', 'READY', 'DELIVERED'];

  statusLabels: Record<string, string> = {
    PENDING:   'Aguardando pagamento',
    PAID:      'Pago',
    PREPARING: 'Preparando',
    READY:     'Pronto',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
  };

  filterOptions: { id: StatusFilter; label: string }[] = [
    { id: '',          label: 'Todos' },
    { id: 'PENDING',   label: 'Aguardando' },
    { id: 'PAID',      label: 'Pagos' },
    { id: 'PREPARING', label: 'Preparando' },
    { id: 'READY',     label: 'Prontos' },
    { id: 'DELIVERED', label: 'Entregues' },
    { id: 'CANCELLED', label: 'Cancelados' }
  ];

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.orderService.getMyOrders(0, 50).subscribe({
      next: (page: PageResponse<Order>) => {
        this.orders = page.content;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setFilter(f: StatusFilter): void {
    this.filter = f;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filtered = this.filter
      ? this.orders.filter(o => o.status === this.filter)
      : this.orders;
  }

  toggle(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  stepIndex(status: OrderStatus): number {
    return this.steps.indexOf(status);
  }

  isStepDone(stepIdx: number, order: Order): boolean {
    if (order.status === 'CANCELLED') return false;
    return stepIdx <= this.stepIndex(order.status);
  }

  isStepActive(stepIdx: number, order: Order): boolean {
    return order.status !== 'CANCELLED' && stepIdx === this.stepIndex(order.status);
  }

  reorder(order: Order): void {
    const ids = order.items.map(i => i.productId);
    forkJoin(ids.map(id => this.productService.getById(id).pipe(catchError(() => of(null)))))
      .subscribe(products => {
        let added = 0;
        products.forEach((p, idx) => {
          if (p && p.active && (p.stock ?? 0) > 0) {
            this.cartService.addItem(p, order.items[idx].quantity);
            added++;
          }
        });
        if (added === 0) {
          alert('Nenhum item desse pedido está disponível agora.');
        } else {
          alert(`${added} item(s) adicionado(s) à sacola.`);
        }
      });
  }

  trackById(_: number, o: Order): number { return o.id; }
}
