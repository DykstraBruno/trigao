// src/app/features/home/pages/home-page/home-page.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductCategory } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { CATEGORIES } from '../../../../core/data/trigao.data';
import { HeroSectionComponent } from '../../../../shared/components/hero-section/hero-section.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroSectionComponent, ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = CATEGORIES;
  selectedCategory: ProductCategory | 'all' = 'all';
  isAddingToCart = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  // Handler do Hero Section - "Adicionar ao Carrinho"
  handleAddToCart(): void {
    // Rolar para os produtos
    this.scrollToProducts();
  }

  // Handler do Hero Section - "Ver Cardápio"
  handleViewMenu(): void {
    this.scrollToProducts();
  }

  // Adicionar produto específico ao carrinho
  onAddToCart(product: Product): void {
    this.isAddingToCart = true;
    this.cartService.addToCart(product, 1);
    
    // Simular delay para UX
    setTimeout(() => {
      this.isAddingToCart = false;
      // TODO: Mostrar toast de sucesso
      console.log(`✅ ${product.name} adicionado ao carrinho!`);
    }, 300);
  }

  // Ver detalhes do produto
  onViewDetails(product: Product): void {
    // TODO: Abrir modal de detalhes
    console.log('Ver detalhes:', product.name);
  }

  // Filtrar por categoria
  filterByCategory(categoryId: ProductCategory | 'all'): void {
    this.selectedCategory = categoryId;
    
    if (categoryId === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === categoryId);
    }
  }

  // Rolar até seção de produtos
  private scrollToProducts(): void {
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Ir para encomendas personalizadas
  goToCustomOrders(): void {
    // Filtrar por categoria "encomendas"
    this.filterByCategory('encomenda');
    this.scrollToProducts();
  }
}
