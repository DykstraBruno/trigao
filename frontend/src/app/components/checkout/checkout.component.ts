import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { StoreService } from '../../services/store.service';
import { LoyaltyService } from '../../services/loyalty.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart.model';
import { Order } from '../../models/order.model';
import { Store } from '../../models/store.model';
import { LoyaltyBalance } from '../../models/loyalty.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  form!: FormGroup;
  cart: Cart = { items: [], total: 0, itemCount: 0 };
  stores: Store[] = [];
  loyalty: LoyaltyBalance | null = null;
  pointsToRedeem = 0;
  loading = false;
  error = '';

  paymentMethods = [
    { value: 'PIX',  label: 'Pix',            icon: 'qr_code_2', desc: 'Pagamento instantâneo' },
    { value: 'CARD', label: 'Cartão de Crédito', icon: 'credit_card', desc: 'Em até 12x' }
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private storeService: StoreService,
    private loyaltyService: LoyaltyService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(c => {
      this.cart = c;
      if (c.items.length === 0) this.router.navigate(['/sacola']);
    });

    this.form = this.fb.group({
      storeId: [null, Validators.required],
      address: ['', Validators.required],
      notes: [''],
      paymentMethod: ['PIX', Validators.required]
    });

    this.storeService.list().subscribe(stores => {
      this.stores = stores;
      if (stores.length === 1) this.form.patchValue({ storeId: stores[0].id });
    });

    if (this.auth.isLoggedIn()) {
      this.loyaltyService.balance().subscribe({
        next: b => this.loyalty = b,
        error: () => this.loyalty = null
      });
    }
  }

  get maxRedeemPoints(): number {
    if (!this.loyalty) return 0;
    const maxFromBalance = this.loyalty.points;
    const maxFromCart = Math.floor(this.cart.total * this.loyalty.maxRedeemFraction * this.loyalty.redeemRatioPoints);
    return Math.max(0, Math.min(maxFromBalance, maxFromCart));
  }

  get redeemDiscount(): number {
    if (!this.loyalty || this.pointsToRedeem <= 0) return 0;
    return Math.min(this.pointsToRedeem, this.maxRedeemPoints) / this.loyalty.redeemRatioPoints;
  }

  get payableTotal(): number {
    return Math.max(0, this.cart.total - this.redeemDiscount);
  }

  setRedeem(n: number): void {
    const capped = Math.max(0, Math.min(Math.floor(n) || 0, this.maxRedeemPoints));
    this.pointsToRedeem = capped;
  }

  useAllPoints(): void {
    this.setRedeem(this.maxRedeemPoints);
  }

  clearRedeem(): void {
    this.pointsToRedeem = 0;
  }

  submit(): void {
    if (this.form.invalid || this.cart.items.length === 0) return;

    this.loading = true;
    this.error = '';

    const request = {
      items: this.cart.items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      storeId: this.form.value.storeId,
      address: this.form.value.address,
      notes: this.form.value.notes,
      paymentMethod: this.form.value.paymentMethod,
      pointsToRedeem: this.pointsToRedeem
    };

    this.orderService.create(request).subscribe({
      next: (order: Order) => {
        this.cartService.clear();
        if (order.billingUrl) {
          window.location.href = order.billingUrl;
        } else {
          this.router.navigate(['/pedido', order.id, 'confirmacao']);
        }
      },
      error: (err: any) => {
        this.error = err?.error?.error || 'Erro ao criar pedido. Tente novamente.';
        this.loading = false;
      }
    });
  }
}
