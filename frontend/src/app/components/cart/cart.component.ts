import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cart: Cart = { items: [], total: 0, itemCount: 0 };

  constructor(private cartService: CartService, private router: Router) {
    this.cartService.cart$.subscribe(c => this.cart = c);
  }

  updateQuantity(item: CartItem, qty: number): void {
    this.cartService.updateQuantity(item.product.id, qty);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }

  clearCart(): void {
    this.cartService.clear();
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
