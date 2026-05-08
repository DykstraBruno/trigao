import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Product, ProductCategory } from '../models/product.model';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pão Francês Artesanal',
    description: 'Crosta dourada e miolo macio, feito várias vezes ao dia.',
    price: 1.5,
    image: 'assets/products/pao-frances.jpg',
    category: 'pao',
    featured: true,
    preparationTime: '15 min'
  },
  {
    id: '2',
    name: 'Bolo de Cenoura com Cobertura',
    description: 'Fatia generosa com cobertura cremosa de chocolate.',
    price: 8.9,
    image: 'assets/products/bolo-cenoura.jpg',
    category: 'bolo',
    featured: true,
    preparationTime: 'Pronto agora'
  },
  {
    id: '3',
    name: 'Brigadeiro Gourmet',
    description: 'Caixa com 6 unidades, finalização premium.',
    price: 16.9,
    image: 'assets/products/brigadeiro.jpg',
    category: 'doce',
    preparationTime: 'Pronto agora'
  },
  {
    id: '4',
    name: 'Croissant de Presunto e Queijo',
    description: 'Massa folhada leve, recheio cremoso e saboroso.',
    price: 12.5,
    image: 'assets/products/croissant.jpg',
    category: 'salgado',
    preparationTime: '20 min'
  },
  {
    id: '5',
    name: 'Cappuccino Trigão',
    description: 'Bebida cremosa com espuma aveludada e toque de canela.',
    price: 9.5,
    image: 'assets/products/cappuccino.jpg',
    category: 'bebida',
    preparationTime: '5 min'
  },
  {
    id: '6',
    name: 'Bolo de Festa Sob Encomenda',
    description: 'Personalize tamanho, recheio e decoração para eventos.',
    price: 120,
    image: 'assets/products/bolo-festa.jpg',
    category: 'encomenda',
    featured: true,
    preparationTime: 'Sob pedido'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getAllProducts(): Observable<Product[]> {
    return of(PRODUCTS);
  }

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    return of(PRODUCTS.filter(product => product.category === category));
  }

  searchProducts(query: string): Observable<Product[]> {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return of(PRODUCTS);
    }

    return of(PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(normalized) ||
      product.description.toLowerCase().includes(normalized)
    ));
  }

  getProductById(productId: string): Observable<Product | undefined> {
    return of(PRODUCTS.find(product => product.id === productId));
  }
}
