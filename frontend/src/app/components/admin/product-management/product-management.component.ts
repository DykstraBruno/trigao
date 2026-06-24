import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, CategoryService } from '../../../services/product.service';
import { Product, ProductImage } from '../../../models/product.model';
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

  // Galeria de imagens
  galleryProduct: Product | null = null;
  galleryImages: ProductImage[] = [];
  newImageUrl = '';
  newImageAlt = '';
  galleryLoading = false;

  openGallery(p: Product): void {
    this.galleryProduct = p;
    this.loadGallery();
  }

  closeGallery(): void {
    this.galleryProduct = null;
    this.galleryImages = [];
    this.newImageUrl = '';
    this.newImageAlt = '';
  }

  loadGallery(): void {
    if (!this.galleryProduct) return;
    this.galleryLoading = true;
    this.productService.listImages(this.galleryProduct.id).subscribe({
      next: imgs => { this.galleryImages = imgs; this.galleryLoading = false; },
      error: () => { this.galleryLoading = false; }
    });
  }

  addImage(): void {
    if (!this.galleryProduct || !this.newImageUrl.trim()) return;
    this.productService.addImage(this.galleryProduct.id, {
      url: this.newImageUrl.trim(),
      altText: this.newImageAlt.trim() || undefined,
      sortOrder: this.galleryImages.length
    }).subscribe(() => {
      this.newImageUrl = '';
      this.newImageAlt = '';
      this.loadGallery();
    });
  }

  removeImage(img: ProductImage): void {
    if (!this.galleryProduct) return;
    if (!confirm('Remover esta imagem?')) return;
    this.productService.deleteImage(this.galleryProduct.id, img.id).subscribe(() => this.loadGallery());
  }

  moveImage(img: ProductImage, delta: number): void {
    if (!this.galleryProduct) return;
    const newOrder = (img.sortOrder ?? 0) + delta;
    this.productService.updateImage(this.galleryProduct.id, img.id, { sortOrder: newOrder })
      .subscribe(() => this.loadGallery());
  }
}
