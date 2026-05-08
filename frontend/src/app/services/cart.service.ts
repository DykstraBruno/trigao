import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly CART_KEY = 'trigao_cart';

  private cartSubject = new BehaviorSubject<Cart>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  get cart(): Cart { return this.cartSubject.value; }

  addItem(product: Product, quantity = 1): void {
    const cart = this.cart;
    const existing = cart.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }
    this.update(cart);
  }

  removeItem(productId: number): void {
    const cart = this.cart;
    cart.items = cart.items.filter(i => i.product.id !== productId);
    this.update(cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.cart;
    const item = cart.items.find(i => i.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
        return;
      }
      item.quantity = quantity;
    }
    this.update(cart);
  }

  clear(): void {
    this.update({ items: [], total: 0, itemCount: 0 });
  }

  private update(cart: Cart): void {
    cart.total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    cart.itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    this.cartSubject.next({ ...cart });
  }

  private loadCart(): Cart {
    const stored = localStorage.getItem(this.CART_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    return { items: [], total: 0, itemCount: 0 };
  }
}
