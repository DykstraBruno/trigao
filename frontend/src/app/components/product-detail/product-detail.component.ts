import { Component, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { SlugService } from '../../services/slug.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  notFound = false;
  quantity = 1;
  added = false;
  shareUrl = '';

  private jsonLdEl: HTMLScriptElement | null = null;
  private canonicalEl: HTMLLinkElement | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private slugService: SlugService,
    private title: Title,
    private meta: Meta,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';
      const id = this.slugService.extractId(slug);
      if (id == null) {
        this.notFound = true;
        this.loading = false;
        return;
      }
      this.loading = true;
      this.productService.getById(id).subscribe({
        next: p => {
          this.product = p;
          this.loading = false;
          this.shareUrl = this.doc.location.href;
          this.applySeo(p);
        },
        error: () => {
          this.notFound = true;
          this.loading = false;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.title.setTitle('Trigão Panificadora');
    ['description', 'og:title', 'og:description', 'og:image', 'og:url', 'twitter:title', 'twitter:description', 'twitter:image']
      .forEach(name => this.meta.removeTag(`name='${name}'`));
    if (this.jsonLdEl) { this.renderer.removeChild(this.doc.head, this.jsonLdEl); this.jsonLdEl = null; }
    if (this.canonicalEl) { this.renderer.removeChild(this.doc.head, this.canonicalEl); this.canonicalEl = null; }
  }

  increase(): void { this.quantity = Math.min(this.quantity + 1, 99); }
  decrease(): void { this.quantity = Math.max(this.quantity - 1, 1); }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addItem(this.product, this.quantity);
    this.added = true;
    setTimeout(() => this.added = false, 1800);
  }

  back(): void { this.router.navigate(['/cardapio']); }

  copyShareUrl(): void {
    if (!this.shareUrl) return;
    navigator.clipboard?.writeText(this.shareUrl);
  }

  whatsappShareUrl(): string {
    return `https://wa.me/?text=${encodeURIComponent(this.shareUrl)}`;
  }

  private applySeo(p: Product): void {
    const titleStr = `${p.name} — Trigão Panificadora`;
    const desc = (p.description || `Compre ${p.name} fresquinho na Trigão Panificadora.`).substring(0, 160);
    const img = p.imageUrl || this.doc.location.origin + '/assets/logo-trigao.png';
    const url = this.doc.location.href;

    this.title.setTitle(titleStr);
    this.upsertMeta('description',        desc);
    this.upsertMeta('og:title',           titleStr);
    this.upsertMeta('og:description',     desc);
    this.upsertMeta('og:image',           img);
    this.upsertMeta('og:url',             url);
    this.upsertMeta('og:type',            'product');
    this.upsertMeta('twitter:card',       'summary_large_image');
    this.upsertMeta('twitter:title',      titleStr);
    this.upsertMeta('twitter:description', desc);
    this.upsertMeta('twitter:image',      img);

    this.setCanonical(url);
    this.setJsonLd(p, url, img);
  }

  private upsertMeta(name: string, content: string): void {
    if (this.meta.getTag(`name='${name}'`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  private setCanonical(url: string): void {
    const existing = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (existing) {
      existing.setAttribute('href', url);
      this.canonicalEl = existing;
      return;
    }
    const link = this.renderer.createElement('link') as HTMLLinkElement;
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.renderer.appendChild(this.doc.head, link);
    this.canonicalEl = link;
  }

  private setJsonLd(p: Product, url: string, img: string): void {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      description: p.description || p.name,
      image: img,
      sku: String(p.id),
      brand: { '@type': 'Brand', name: 'Trigão Panificadora' },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'BRL',
        price: p.price,
        availability: (p.stock ?? 0) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock'
      }
    };
    if (this.jsonLdEl) this.renderer.removeChild(this.doc.head, this.jsonLdEl);
    const script = this.renderer.createElement('script') as HTMLScriptElement;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.renderer.appendChild(this.doc.head, script);
    this.jsonLdEl = script;
  }
}
