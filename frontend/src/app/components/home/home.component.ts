import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  addedToCart: Set<number> = new Set();
  loading = true;
  loadError = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts(0, 6).subscribe({
      next: page => {
        this.featuredProducts = page.content;
        this.loading = false;
      },
      error: err => {
        console.error('Falha ao carregar produtos em destaque', err);
        this.loadError = true;
        this.loading = false;
      }
    });
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
    this.addedToCart.add(product.id);
    setTimeout(() => this.addedToCart.delete(product.id), 1500);
  }
}
