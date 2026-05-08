import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() viewMode: 'grid' | 'list' = 'grid';

  @Output() addToCart = new EventEmitter<Product>();
  @Output() viewDetails = new EventEmitter<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.product);
  }
}
