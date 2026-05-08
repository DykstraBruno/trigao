// src/app/features/cart/pages/cart-page/cart-page.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  cartItems$!: Observable<CartItem[]>;
  cartTotal = 0;
  cartCount = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;
    
    // Atualizar total
    this.cartService.cartItems$.subscribe(items => {
      this.cartTotal = this.cartService.getCartTotal();
      this.cartCount = this.cartService.getCartCount();
    });
  }

  // Aumentar quantidade
  increaseQuantity(productId: string, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  // Diminuir quantidade
  decreaseQuantity(productId: string, currentQty: number): void {
    if (currentQty > 1) {
      this.cartService.updateQuantity(productId, currentQty - 1);
    }
  }

  // Remover item
  removeItem(productId: string): void {
    if (confirm('Deseja remover este item do carrinho?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  // Limpar carrinho
  clearCart(): void {
    if (confirm('Deseja limpar o carrinho?')) {
      this.cartService.clearCart();
    }
  }

  // Continuar comprando
  continueShopping(): void {
    this.router.navigate(['/']);
  }

  // Ir para checkout
  goToCheckout(): void {
    if (this.cartCount === 0) {
      alert('Adicione produtos ao carrinho antes de finalizar!');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  // Calcular subtotal de um item
  getItemSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }
}
