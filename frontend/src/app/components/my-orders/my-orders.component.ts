import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { Order, OrderStatus } from '../../models/order.model';
import { PageResponse } from '../../models/product.model';
import { ReviewableItem } from '../../models/review.model';
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

  // Reviews
  reviewable: ReviewableItem[] = [];
  reviewFormFor: { orderId: number; productId: number } | null = null;
  reviewRating = 5;
  reviewComment = '';
  reviewSaving = false;
  reviewError = '';

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private productService: ProductService,
    private reviewService: ReviewService
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
    this.loadReviewable();
  }

  loadReviewable(): void {
    this.reviewService.reviewable().subscribe({
      next: list => this.reviewable = list,
      error: () => this.reviewable = []
    });
  }

  canReview(orderId: number, productId: number): boolean {
    return this.reviewable.some(r => r.orderId === orderId && r.productId === productId);
  }

  openReviewForm(orderId: number, productId: number): void {
    this.reviewFormFor = { orderId, productId };
    this.reviewRating = 5;
    this.reviewComment = '';
    this.reviewError = '';
  }

  cancelReview(): void {
    this.reviewFormFor = null;
  }

  setRating(n: number): void {
    this.reviewRating = n;
  }

  submitReview(): void {
    if (!this.reviewFormFor) return;
    this.reviewSaving = true;
    this.reviewError = '';
    this.reviewService.create({
      orderId: this.reviewFormFor.orderId,
      productId: this.reviewFormFor.productId,
      rating: this.reviewRating,
      comment: this.reviewComment.trim() || undefined
    }).subscribe({
      next: () => {
        // remove da lista de "avaliáveis"
        this.reviewable = this.reviewable.filter(
          r => !(r.orderId === this.reviewFormFor!.orderId && r.productId === this.reviewFormFor!.productId)
        );
        this.reviewFormFor = null;
        this.reviewSaving = false;
      },
      error: err => {
        this.reviewError = err?.error?.error || 'Falha ao salvar avaliação.';
        this.reviewSaving = false;
      }
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
