import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartItem } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cartCount$: Observable<number>;
  isMobileMenuOpen = false;

  constructor(private cartService: CartService) {
    this.cartCount$ = this.cartService.cartItems$.pipe(
      map((items: CartItem[]) => items.reduce((total: number, item: CartItem) => total + item.quantity, 0))
    );
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
