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

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts(0, 6).subscribe(page => {
      this.featuredProducts = page.content;
    });
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
    this.addedToCart.add(product.id);
    setTimeout(() => this.addedToCart.delete(product.id), 1500);
  }
}
