import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, CategoryService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  form!: FormGroup;
  editingId: number | null = null;
  showForm = false;
  loading = true;
  saving = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.buildForm();
  }

  loadData(): void {
    this.loading = true;
    this.productService.getProducts(0, 100).subscribe({
      next: page => { this.products = page.content; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
  }

  buildForm(p?: Product): void {
    this.form = this.fb.group({
      name:        [p?.name || '',        Validators.required],
      description: [p?.description || '', Validators.required],
      price:       [p?.price || '',       [Validators.required, Validators.min(0.01)]],
      imageUrl:    [p?.imageUrl || ''],
      categoryId:  [p?.categoryId || '',  Validators.required],
      stock:       [p?.stock ?? 0,        [Validators.required, Validators.min(0)]],
      active:      [p?.active ?? true]
    });
  }

  openCreate(): void { this.editingId = null; this.buildForm(); this.showForm = true; this.error = ''; }

  openEdit(p: Product): void {
    this.editingId = p.id;
    this.buildForm(p);
    this.showForm = true;
    this.error = '';
  }

  cancel(): void { this.showForm = false; this.editingId = null; }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';
    const data = this.form.value;
    const op = this.editingId
      ? this.productService.update(this.editingId, data)
      : this.productService.create(data);
    op.subscribe({
      next: () => { this.cancel(); this.loadData(); this.saving = false; },
      error: (err: any) => { this.error = err?.error?.error || 'Erro ao salvar produto.'; this.saving = false; }
    });
  }

  delete(p: Product): void {
    if (!confirm(`Deseja remover "${p.name}"?`)) return;
    this.productService.delete(p.id).subscribe({ next: () => this.loadData() });
  }
}
