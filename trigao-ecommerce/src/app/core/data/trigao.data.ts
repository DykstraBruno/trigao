import { ProductCategory } from '../models/product.model';

export interface CategoryItem {
  id: ProductCategory;
  name: string;
  icon: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'pao', name: 'Pães', icon: 'bread' },
  { id: 'bolo', name: 'Bolos', icon: 'cake' },
  { id: 'doce', name: 'Doces', icon: 'candy' },
  { id: 'salgado', name: 'Salgados', icon: 'croissant' },
  { id: 'bebida', name: 'Bebidas', icon: 'coffee' },
  { id: 'encomenda', name: 'Encomendas', icon: 'gift' }
];
