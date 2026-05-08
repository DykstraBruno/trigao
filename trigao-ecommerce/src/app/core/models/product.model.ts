export type ProductCategory = 'pao' | 'bolo' | 'doce' | 'salgado' | 'bebida' | 'encomenda';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  badge?: string;
  featured?: boolean;
  preparationTime?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  observations?: string;
}
