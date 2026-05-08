import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

interface Category {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  // Data
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [
    { id: 'pao', name: 'Pães', icon: 'bread' },
    { id: 'bolo', name: 'Bolos', icon: 'cake' },
    { id: 'doce', name: 'Doces', icon: 'candy' },
    { id: 'salgado', name: 'Salgados', icon: 'croissant' },
    { id: 'encomenda', name: 'Encomendas', icon: 'gift' }
  ];

  // Filters
  searchQuery: string = '';
  selectedCategory: string = 'all';
  sortBy: 'popular' | 'name' | 'price-asc' | 'price-desc' = 'popular';
  viewMode: 'grid' | 'list' = 'grid';
  sortDropdownOpen: boolean = false;

  // State
  isAddingToCart: boolean = false;
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject$.complete();
  }

  /**
   * Load products from service
   */
  private loadProducts(): void {
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
        this.applyAllFilters();
      });
  }

  /**
   * Setup search with debounce to avoid excessive filtering
   */
  private setupSearchDebounce(): void {
    this.searchSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyAllFilters();
    });
  }

  /**
   * Handle search input with debounce
   */
  onSearch(query: string): void {
    this.searchQuery = query;
    this.searchSubject$.next(query);
  }

  /**
   * Clear search query
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject$.next('');
  }

  /**
   * Filter products by category
   */
  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.applyAllFilters();
  }

  /**
   * Change sort order
   */
  changeSortBy(sortOption: 'popular' | 'name' | 'price-asc' | 'price-desc'): void {
    this.sortBy = sortOption;
    this.sortDropdownOpen = false;
    this.applyAllFilters();
  }

  /**
   * Change view mode (grid or list)
   */
  changeViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  /**
   * Apply all active filters and sorting
   */
  private applyAllFilters(): void {
    let result = [...this.products];

    // Category filter
    if (this.selectedCategory !== 'all') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    result = this.applySorting(result);

    this.filteredProducts = result;
  }

  /**
   * Apply sorting to products
   */
  private applySorting(products: Product[]): Product[] {
    const sorted = [...products];

    switch (this.sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        // Assume products are already sorted by popularity from backend
        break;
    }

    return sorted;
  }

  /**
   * Get category name by ID
   */
  getCategoryName(categoryId: string): string {
    if (categoryId === 'all') return 'Todos os Produtos';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Produtos';
  }

  /**
   * Add product to cart
   */
  onAddToCart(product: Product): void {
    this.isAddingToCart = true;
    this.cartService.addToCart(product, 1);

    // Simulate delay for better UX feedback
    setTimeout(() => {
      this.isAddingToCart = false;
    }, 300);
  }

  /**
   * View product details (open modal or navigate)
   */
  onViewDetails(product: Product): void {
    // Navigate to product detail page or open modal
    this.router.navigate(['/produtos', product.id]);
  }
}
