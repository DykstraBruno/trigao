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
  categories = [
    { id: 'paes', icon: 'bakery_dining', name: 'Pães' },
    { id: 'bolos', icon: 'cake', name: 'Bolos' },
    { id: 'salgados', icon: 'lunch_dining', name: 'Salgados' },
    { id: 'encomendas', icon: 'celebration', name: 'Encomendas' },
    { id: 'bebidas', icon: 'local_cafe', name: 'Bebidas' }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts(0, 6).subscribe(page => {
      this.featuredProducts = page.content;
    });
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Bom dia! Que tal um café?';
    }

    if (hour < 18) {
      return 'Boa tarde! Hora de um lanche especial';
    }

    return 'Boa noite! Ainda tem fornada quentinha';
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
    this.addedToCart.add(product.id);
    setTimeout(() => this.addedToCart.delete(product.id), 1500);
  }

}
