export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  sortOrder?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  categoryName?: string;
  active?: boolean;
  stock?: number;
  images?: ProductImage[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
