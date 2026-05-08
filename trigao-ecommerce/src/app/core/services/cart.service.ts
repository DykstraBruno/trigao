import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CartItem, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'trigao_cart';
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());

  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(product: Product, quantity = 1): void {
    const items = [...this.cartItemsSubject.value];
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    this.saveCart(items);
  }

  removeFromCart(productId: string): void {
    const items = this.cartItemsSubject.value.filter(item => item.product.id !== productId);
    this.saveCart(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.cartItemsSubject.value
      .map(item => item.product.id === productId ? { ...item, quantity } : item)
      .filter(item => item.quantity > 0);

    this.saveCart(items);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }

  private saveCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private loadCart(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  }
}
