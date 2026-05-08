import { Component, OnInit } from '@angular/core';
import { ProductService, CategoryService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, PageResponse } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    this.loadProducts();
    this.searchSubject.pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => { this.currentPage = 0; this.loadProducts(); });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.currentPage, 12, this.selectedCategory, this.searchQuery || undefined)
      .subscribe({
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

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
