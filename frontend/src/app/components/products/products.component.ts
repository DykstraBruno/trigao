import { Component, OnInit } from '@angular/core';
import { ProductService, CategoryService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, PageResponse } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: number | undefined;
  searchQuery = '';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  loading = false;
  addedToCart: Set<number> = new Set();
  activeCategoryChip = 'todos';
  quickCategories = [
    { id: 'todos', label: 'Todos', icon: 'apps' },
    { id: 'paes', label: 'Paes', icon: 'bakery_dining' },
    { id: 'bolos', label: 'Bolos', icon: 'cake' },
    { id: 'salgados', label: 'Salgados', icon: 'lunch_dining' },
    { id: 'encomendas', label: 'Encomendas', icon: 'celebration' },
    { id: 'bebidas', label: 'Bebidas', icon: 'local_cafe' }
  ];

  selectedProduct: Product | null = null;
  selectedQty = 1;
  observations = '';

  // Filtros avançados
  minPrice: number | null = null;
  maxPrice: number | null = null;
  inStockOnly = false;
  showAdvancedFilters = false;

  private searchSubject = new Subject<string>();
  private filterSubject = new Subject<void>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats;
      this.selectQuickCategory(this.activeCategoryChip);
    });
    this.searchSubject.pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => { this.currentPage = 0; this.loadProducts(); });

    this.filterSubject.pipe(debounceTime(400))
      .subscribe(() => { this.currentPage = 0; this.loadProducts(); });

    this.route.queryParamMap.subscribe(params => {
      const chip = params.get('categoria') || 'todos';
      this.selectQuickCategory(chip);
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(
      this.currentPage, 12,
      this.selectedCategory,
      this.searchQuery || undefined,
      this.minPrice ?? undefined,
      this.maxPrice ?? undefined,
      this.inStockOnly
    ).subscribe({
      next: (page: PageResponse<Product>) => {
        this.products = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFilterChange(): void {
    this.filterSubject.next();
  }

  toggleAdvanced(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  clearFilters(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.inStockOnly = false;
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return this.minPrice != null || this.maxPrice != null || this.inStockOnly || !!this.searchQuery;
  }

  selectCategory(id: number | undefined): void {
    this.selectedCategory = id;
    this.currentPage = 0;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
    this.addedToCart.add(product.id);
    setTimeout(() => this.addedToCart.delete(product.id), 1500);
  }

  selectQuickCategory(chipId: string): void {
    this.activeCategoryChip = chipId;
    this.selectedCategory = undefined;

    if (chipId !== 'todos') {
      const matched = this.categories.find(cat => this.normalize(cat.name) === chipId);
      this.selectedCategory = matched?.id;
    }

    this.currentPage = 0;
    this.loadProducts();
  }

  openDetails(product: Product): void {
    this.selectedProduct = product;
    this.selectedQty = 1;
    this.observations = '';
  }

  closeDetails(): void {
    this.selectedProduct = null;
  }

  increaseQty(): void {
    this.selectedQty = Math.min(this.selectedQty + 1, 99);
  }

  decreaseQty(): void {
    this.selectedQty = Math.max(this.selectedQty - 1, 1);
  }

  getTotalPrice(): number {
    if (!this.selectedProduct) {
      return 0;
    }

    return this.selectedProduct.price * this.selectedQty;
  }

  addModalToCart(): void {
    if (!this.selectedProduct) {
      return;
    }

    this.cartService.addItem(this.selectedProduct, this.selectedQty);
    this.addedToCart.add(this.selectedProduct.id);
    setTimeout(() => this.addedToCart.delete(this.selectedProduct!.id), 1500);
    this.closeDetails();
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
