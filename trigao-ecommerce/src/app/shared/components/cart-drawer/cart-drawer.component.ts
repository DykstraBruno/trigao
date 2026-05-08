// src/app/shared/components/cart-drawer/cart-drawer.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss']
})
export class CartDrawerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  cartItems$!: Observable<CartItem[]>;
  cartTotal = 0;
  cartCount = 0;
  isOpen = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;
    
    this.cartService.cartItems$.subscribe(items => {
      this.cartTotal = this.cartService.getCartTotal();
      this.cartCount = this.cartService.getCartCount();
    });
  }

  open(): void {
    this.isOpen = true;
  }

  closeDrawer(): void {
    this.isOpen = false;
    this.close.emit();
  }

  increaseQuantity(productId: string, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  decreaseQuantity(productId: string, currentQty: number): void {
    if (currentQty > 1) {
      this.cartService.updateQuantity(productId, currentQty - 1);
    } else {
      this.removeItem(productId);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  getItemSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  goToCheckout(): void {
    this.closeDrawer();
    this.router.navigate(['/checkout']);
  }

  goToCart(): void {
    this.closeDrawer();
    this.router.navigate(['/carrinho']);
  }
}
